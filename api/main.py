from dns import message
from flask import Flask
from flask import json
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request
from flask_pymongo import PyMongo
import requests
from bs4 import BeautifulSoup as bs
from bson.objectid import ObjectId
from bson import json_util
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
import uuid
import bcrypt
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['DB_NAME'] = 'bmarker'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/bmarker'
# app.config['MONGO_URI'] = 'mongodb+srv://admin:0admin0@bmarkercluster.iid44.mongodb.net/bmarker?retryWrites=true&w=majority'

# Setup the Flask-JWT-Extended extension
app.config['JWT_SECRET_KEY'] = str(os.urandom(16))
jwt = JWTManager(app)

mongo = PyMongo(app)


def recursiveNodeIter(node, action, b_type, itr=0, *args, **kwargs):
    while itr >= 0:
        childNode = mongo.db.bookmarks.find_one_or_404(
            {
                "key": node['children'][itr],
                "user_id": node['user_id']
            })
        if childNode['leaf'] == True:
            if action == 'fetch':
                if b_type == 'folders':
                    if childNode['feature'] == 'folder':
                        node['children'][itr] = childNode
                    else:
                        del node['children'][itr]
                        if len(node['children']) == 0:
                            node['leaf'] = True
                else:
                    node['children'][itr] = childNode
            elif action == 'delete':
                # Deleting the Leaf Node
                mongo.db.bookmarks.delete_one(
                    {'_id': ObjectId(childNode['_id'])})
        else:
            itrChildnode = mongo.db.bookmarks.find_one_or_404(
                {
                    "key": node['children'][itr],
                    "user_id": node['user_id']
                })
            if action == 'fetch':
                if itrChildnode['feature'] == 'folder':
                    node['children'][itr] = recursiveNodeIter(
                        itrChildnode, action, b_type, itr=len(itrChildnode['children'])-1)
                else:
                    del node['children'][itr]
                    if len(node['children']) == 0:
                        node['leaf'] = True
            elif action == 'delete':
                nodeToDel = recursiveNodeIter(
                    itrChildnode, action, b_type, itr=len(itrChildnode['children'])-1)
                mongo.db.bookmarks.delete_one(
                    {
                        "key": nodeToDel['key'],
                        "user_id": node['user_id']
                    })
        # i += 1
        itr -= 1
    return node


@app.route('/signup', methods=['POST'])
def signup():
    userObj = request.json['signup']
    user = {
        "_id": ObjectId(),
        "firstName": userObj['firstName'],
        "lastName": userObj['lastName'],
        "email": userObj['email'],
        "password": bcrypt.hashpw(userObj['password'].encode('utf-8'), bcrypt.gensalt()),
        "root_bookmark_key": str(uuid.uuid4())
    }
    # Check unique mail ID
    userCheck = mongo.db.user.find_one({"email": user['email']})
    if not(userCheck):
        userDoc = mongo.db.user.insert_one(user)
        bookmark = {
            "user_id": user.get('_id'),
            # "key":  user.get('root_bookmark_key'),
            "key":  "my-bookmarks",
            "label": "My Bookmarks",
            "data": "my_bookmarks",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "feature": "folder",
            "children": [],
            "parent": "null",
            "leaf": True,
            "expanded": True
        }

        bookmarkDoc = mongo.db.bookmarks.insert_one(bookmark)
        return jsonify(message="userAdded"), 200
    else:
        return "EmailId already exists", 400
    #     return jsonify({'message': 'userAdded'}), 200
    # else:
    #     return jsonify({'error': 'EmailId already exists'}), 400


@app.route('/login', methods=['POST'])
def login():
    loginUserObj = request.json['login']
    userDoc = mongo.db.user.find_one({"email": loginUserObj['email']})
    bookmarkDoc = mongo.db.bookmarks.find_one({
        "key": userDoc['root_bookmark_key'],
        "user_id": userDoc['_id']
    })
    if not(userDoc):
        return jsonify({'error': 'Account not found, Check your Email Address'}), 404
    elif not(bcrypt.checkpw(loginUserObj['password'].encode('utf-8'), userDoc['password'])):
        return jsonify({'error': 'Invalid Password'}), 404
    else:
        access_token = create_access_token(identity=str(userDoc['_id']))
        # return json.dumps({
        #     'user_id': str(userDoc['_id']),
        #     'root_bookmark_key': str(userDoc['root_bookmark_key']),
        #     'token': access_token
        # }, default=json_util.default), 200
        return jsonify({
            'user_id': str(userDoc['_id']),
            'root_bookmark_key': str(userDoc['root_bookmark_key']),
            'token': access_token
        }),  200


@app.route('/', methods=['POST', 'GET'])
@jwt_required
def getBookmarkTree():
    # breakpoint()
    bookmarkTree = None
    if request.method == 'POST':
        userBmarkReqObj = request.json
        current_user = get_jwt_identity()
        print(userBmarkReqObj)
        bookmarkTree = mongo.db.bookmarks.find_one(
            {
                # "user_id": ObjectId(userBmarkReqObj['user_id']),
                "user_id": ObjectId(current_user),
                "key": "my-bookmarks" if "bookmark_key" in userBmarkReqObj and userBmarkReqObj['bookmark_key'] is None else userBmarkReqObj['bookmark_key']
            })
        recursiveNodeIter(bookmarkTree, 'fetch', b_type=userBmarkReqObj['b_type'],
                          itr=len(bookmarkTree['children'])-1)
    # return jsonify({'data': [bookmarkTree]})

        return json.dumps({'data': [bookmarkTree]}, default=json_util.default)


@app.route('/addFolder', methods=['POST'])
@jwt_required
def newFolder():
    # Get New folder from request
    newDoc = request.json['folder']
    newDoc['_id'] = ObjectId()
    # newDoc['user_id'] = ObjectId(newDoc['user_id'])
    newDoc['user_id'] = ObjectId(get_jwt_identity())
    # Inserting new Folder Node in DB
    mongo.db.bookmarks.insert_one(newDoc)
    # Fetch parent of new Node to be added
    parentDoc = mongo.db.bookmarks.find_one_or_404(
        {
            "key": newDoc['parent'],
            "user_id": ObjectId(newDoc['user_id'])
        })
    # update new Folder to children array of parent
    parentDoc['children'].append(newDoc['key'])
    parentDoc['leaf'] = False
    # update changed parent Folder Node in DB
    mongo.db.bookmarks.update_one(
        {
            "key": parentDoc['key'],
            "user_id": ObjectId(newDoc["user_id"])
        }, {"$set": parentDoc})
    return jsonify(status="added"), 200


@app.route('/addURL', methods=['POST'])
@jwt_required
def newURLLink():
    # Get New URL node to be added
    newDoc = request.json['URLNode']
    newDoc['_id'] = ObjectId()
    # newDoc['user_id'] = ObjectId(newDoc['user_id'])
    newDoc['user_id'] = ObjectId(get_jwt_identity())
    # Fetch ParentNode selected in UI from DB
    parentDoc = mongo.db.bookmarks.find_one_or_404({"key": newDoc['parent']})
    parentDoc['children'].append(newDoc['key'])
    parentDoc['leaf'] = False
    # Modify URL node Label and insert into DB
    newDoc = linkObjUpdate(newDoc)
    mongo.db.bookmarks.insert_one(newDoc)
    # Update ParentNode children array
    mongo.db.bookmarks.update_one(
        {'key': parentDoc['key']}, {"$set": parentDoc})

    return jsonify(status="urlAdded"), 200


@app.route('/renameFolder', methods=['POST'])
@jwt_required
def renameFolder():
    # Fetch rename Folder key & user from Request
    folderToRenameKey = request.json['key']
    userId = ObjectId(get_jwt_identity())
    renameFolder = request.json['renameFolder']
    docToRename = mongo.db.bookmarks.find_one_or_404(
        {
            "key": folderToRenameKey,
            "user_id": userId
        })

    # Rename the Current Folder Node fields
    docToRename['label'] = renameFolder['label']
    docToRename['data'] = renameFolder['data']
    mongo.db.bookmarks.update_one(
        {
            "key": folderToRenameKey,
            "user_id": userId,
        }, {"$set": docToRename})
    return jsonify(status="renamed"), 200


@app.route('/deleteFolder', methods=['POST'])
@jwt_required
def deleteFolder():
    folderToDelKey = request.json['key']
    userId = ObjectId(get_jwt_identity())
    # Find node to be deleted
    delDoc = mongo.db.bookmarks.find_one_or_404(
        {
            "key": folderToDelKey,
            "user_id": userId
        })
    # Delete all children Nodes Recursively
    if(delDoc['leaf'] != True):
        recursiveNodeIter(delDoc, 'delete', b_type=delDoc['b_type'], itr=len(
            delDoc['children'])-1)
    # Delete Name in Parent Array
    parentNode = mongo.db.bookmarks.find_one_or_404(
        {
            "key": delDoc['parent'],
            "user_id": userId
        })
    parentNode['children'].remove(delDoc['key'])
    if len(parentNode['children']) == 0:
        parentNode['leaf'] = True
    mongo.db.bookmarks.update_one(
        {
            "_id": ObjectId(parentNode["_id"]),
            "key": delDoc['parent'],
            "user_id": userId
        }, {"$set": parentNode})

    # Delete the Current Node
    mongo.db.bookmarks.delete_one({
        "_id": ObjectId(delDoc["_id"]),
        "key": delDoc["key"],
        "user_id": userId
    })
    return jsonify(status="deleted"), 200


def linkObjUpdate(URLObj):
    # breakpoint()
    webPageTitle = getPageTitle(URLObj['data'])
    # print(webPageTitle)
    if webPageTitle['valid']:
        URLObj['label'] = webPageTitle['title']
    return URLObj


def getPageTitle(urlString):
    pageTitleResponse = {
        'valid': False,
        'title': '',
    }
    try:
        webReq = requests.get(urlString)
        htmlCode = bs(webReq.content, 'lxml')
        pageTitleResponse['valid'] = True
        pageTitleResponse['title'] = htmlCode.select_one('title').text
    except requests.RequestException as reqExp:
        exceptionName = type(reqExp).__name__
        pageTitleResponse['valid'] = False
        if exceptionName == 'MissingSchema':
            pageTitleResponse['title'] = """Oops!!!, {0}']""".format(
                reqExp.args[0])
        else:
            pageTitleResponse['title'] = "Oops!!!, Your Bookmarked URL can't be reached"
    return pageTitleResponse


if __name__ == "__main__":
    app.run(debug=True)
