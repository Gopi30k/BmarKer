import bcrypt
from os import error
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

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['DB_NAME'] = 'bmarker'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/bmarker'
# app.config['MONGO_URI'] = 'mongodb+srv://admin:0admin0@bmarkercluster.iid44.mongodb.net/bmarker?retryWrites=true&w=majority'

mongo = PyMongo(app)


def recursiveNodeIter(node, action, *args, **kwargs):

    i = 0
    while i < len(node['children']):
        childNode = mongo.db.bookmarks.find_one_or_404(
            {"key": node['children'][i]}, {"_id": 0})
        if childNode['leaf'] == True:
            if action == 'fetch':
                node['children'][i] = childNode
            elif action == 'delete':
                # Deleting the Leaf Node
                mongo.db.bookmarks.delete_one({'key': childNode['key']})
        else:
            node['children'][i] = recursiveNodeIter(mongo.db.bookmarks.find_one_or_404(
                {"key": node['children'][i]}, {"_id": 0}), action)
        i += 1
    return node


@app.route('/signup', methods=['POST'])
def signup():
    userObj = request.json['signup']
    user = {
        "_id": ObjectId(),
        "fname": userObj['fname'],
        "lname": userObj['lname'],
        "email": userObj['email'],
        "password": bcrypt.hashpw(userObj['password'].encode('utf-8'), bcrypt.gensalt()),
        "root_bookmark_id": ObjectId()
    }
    # Check unique mail ID
    userCheck = mongo.db.user.find_one({"email": user['email']})
    if not(userCheck):
        userDoc = mongo.db.user.insert_one(user)
        bookmark = {
            "_id": user.get('root_bookmark_id'),
            "key": "5e9a7e56-858b-4cc8-be8b-14ad6d1801a8",
            "user_id": user.get('_id'),
            "label": "My Bookmarks",
            "data": "my_bookmarks",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "feature": "folder",
            "children": [],
            "parent": "null",
            "leaf": False
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
    if not(userDoc):
        return jsonify({'error': 'Account not found, Check your Email Address'}), 404
    elif not(bcrypt.checkpw(loginUserObj['password'].encode('utf-8'), userDoc['password'])):
        return jsonify({'error': 'Invalid Password'}), 404
    return json.dumps({
        'user_id': str(userDoc['_id']),
        'root_bookmark': str(userDoc['root_bookmark_id'])
    }, default=json_util.default), 200


@app.route('/', methods=['POST', 'GET'])
def getBookmarkTree():
    bookmarkTree = None
    if request.method == 'POST':
        key_name = request.json['bookmark']
        bookmarkTree = mongo.db.bookmarks.find_one(
            {"_id": ObjectId(key_name)})
    recursiveNodeIter(bookmarkTree, 'fetch')
    # return jsonify({'data': [bookmarkTree]})
    return json.dumps({'data': [bookmarkTree]}, default=json_util.default)


@app.route('/addFolder', methods=['POST'])
def newFolder():
    newDoc = request.json['folder']
    parentDoc = mongo.db.bookmarks.find_one_or_404({"key": newDoc['parent']})
    parentDoc['children'].append(newDoc['key'])
    parentDoc['leaf'] = False
    mongo.db.bookmarks.update_one(
        {'key': parentDoc['key']}, {"$set": parentDoc})
    mongo.db.bookmarks.insert_one(newDoc)
    return jsonify(status="added"), 200


@app.route('/addURL', methods=['POST'])
def newURLLink():
    newDoc = request.json['URLNode']
    parentDoc = mongo.db.bookmarks.find_one_or_404({"key": newDoc['parent']})
    parentDoc['children'].append(newDoc['key'])
    parentDoc['leaf'] = False
    mongo.db.bookmarks.update_one(
        {'key': parentDoc['key']}, {"$set": parentDoc})
    newDoc = linkObjUpdate(newDoc)
    print(newDoc)
    mongo.db.bookmarks.insert_one(newDoc)
    return jsonify(status="urlAdded"), 200


@app.route('/renameFolder', methods=['POST'])
def renameFolder():
    # Fetch data from Request
    folderToRenameKey = request.json['key']
    renameFolder = request.json['renameFolder']
    docToRename = mongo.db.bookmarks.find_one_or_404(
        {'key': folderToRenameKey}, {"_id": 0})

    # Rename the Current Node
    docToRename['label'] = renameFolder['label']
    docToRename['data'] = renameFolder['data']
    mongo.db.bookmarks.update_one(
        {'key': folderToRenameKey}, {"$set": docToRename})
    return jsonify(status="renamed"), 200


@app.route('/deleteFolder', methods=['POST'])
def deleteFolder():
    folderToDelKey = request.json['key']
    delDoc = mongo.db.bookmarks.find_one_or_404(
        {'key': folderToDelKey}, {"_id": 0})
    # Delete all children Nodes Recursively
    if(delDoc['leaf'] != True):
        # recursiveNodeIter(delDoc, 'delete')
        mongo.db.bookmarks.delete_many({'parent': delDoc['key']})
    # Delete Name in Parent Array
    parentNode = mongo.db.bookmarks.find_one_or_404(
        {"key": delDoc['parent']}, {"_id": 0})
    parentNode['children'].remove(delDoc['key'])
    mongo.db.bookmarks.update_one(
        {"key": delDoc['parent']}, {"$set": parentNode})

    # Delete the Current Node
    mongo.db.bookmarks.delete_one({'key': delDoc['key']})
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
