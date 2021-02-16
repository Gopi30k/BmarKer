from flask import Blueprint, request, jsonify, json
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
from .db_config import mongo
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from bs4 import BeautifulSoup as bs
from bson.objectid import ObjectId
from bson import json_util
import uuid
import bcrypt
import os
import requests
bmarker = Blueprint('bmarker', __name__)


@bmarker.route('/signup', methods=['POST'])
def signup():
    user_collection = mongo.db.users
    bookmark_collection = mongo.db.bookmarks
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
    userCheck = user_collection.find_one({"email": user['email']})
    if not(userCheck):
        user_collection.insert_one(user)
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

        bookmark_collection.insert_one(bookmark)
        return jsonify(message="userAdded"), 200
    else:
        return jsonify(error="EmailId already exists"), 400


@bmarker.route('/login', methods=['POST'])
def login():
    user_collection = mongo.db.users
    bookmark_collection = mongo.db.bookmarks
    loginUserObj = request.json['login']
    userDoc = user_collection.find_one({"email": loginUserObj['email']})

    if not(userDoc):
        return jsonify({'error': 'Invalid Email Address'}), 404
    if not(bcrypt.checkpw(loginUserObj['password'].encode('utf-8'), userDoc['password'])):
        return jsonify({'error': 'Invalid Password'}), 404
    else:
        access_token = create_access_token(
            identity=str(userDoc['_id']), expires_delta=False)
        return jsonify({
            'user_id': str(userDoc['_id']),
            'root_bookmark_key': str(userDoc['root_bookmark_key']),
            'token': access_token
        }),  200


@bmarker.route('/', methods=['POST', 'GET'])
@jwt_required
def getBookmarkTree():
    # user_collection = mongo.db.users
    bookmark_collection = mongo.db.bookmarks
    bookmarkTree = None
    if request.method == 'POST':
        userBmarkReqObj = request.json
        current_user = get_jwt_identity()
        bookmarkTree = bookmark_collection.find_one(
            {
                "user_id": ObjectId(current_user),
                "key": "my-bookmarks" if "bookmark_key" in userBmarkReqObj and userBmarkReqObj['bookmark_key'] is None else userBmarkReqObj['bookmark_key']
            })
        recursiveNodeIter(bookmarkTree, 'fetch', b_type=userBmarkReqObj['b_type'],
                          itr=len(bookmarkTree['children'])-1)
        return json.dumps({'data': [bookmarkTree]}, default=json_util.default)


@bmarker.route('/addFolder', methods=['POST'])
@jwt_required
def newFolder():
    user_collection = mongo.db.users
    bookmark_collection = mongo.db.bookmarks
    # Get New folder from request
    newDoc = request.json['folder']
    newDoc['_id'] = ObjectId()
    # newDoc['user_id'] = ObjectId(newDoc['user_id'])
    newDoc['user_id'] = ObjectId(get_jwt_identity())
    # Inserting new Folder Node in DB
    bookmark_collection.insert_one(newDoc)
    # Fetch parent of new Node to be added
    parentDoc = bookmark_collection.find_one_or_404(
        {
            "key": newDoc['parent'],
            "user_id": ObjectId(newDoc['user_id'])
        })
    # update new Folder to children array of parent
    parentDoc['children'].append(newDoc['key'])
    parentDoc['leaf'] = False
    # update changed parent Folder Node in DB
    bookmark_collection.update_one(
        {
            "key": parentDoc['key'],
            "user_id": ObjectId(newDoc["user_id"])
        }, {"$set": parentDoc})
    return jsonify(status="added"), 200


@bmarker.route('/addURL', methods=['POST'])
@jwt_required
def newURLLink():
    user_collection = mongo.db.users
    bookmark_collection = mongo.db.bookmarks
    # Get New URL node to be added
    newDoc = request.json['URLNode']
    newDoc['_id'] = ObjectId()
    # newDoc['user_id'] = ObjectId(newDoc['user_id'])
    newDoc['user_id'] = ObjectId(get_jwt_identity())
    # Fetch ParentNode selected in UI from DB
    parentDoc = bookmark_collection.find_one_or_404({"key": newDoc['parent']})
    parentDoc['children'].append(newDoc['key'])
    parentDoc['leaf'] = False
    # Modify URL node Label and insert into DB
    newDoc = linkObjUpdate(newDoc)
    bookmark_collection.insert_one(newDoc)
    # Update ParentNode children array
    bookmark_collection.update_one(
        {'key': parentDoc['key']}, {"$set": parentDoc})

    return jsonify(status="urlAdded"), 200


@bmarker.route('/renameFolder', methods=['POST'])
@jwt_required
def renameFolder():
    user_collection = mongo.db.users
    bookmark_collection = mongo.db.bookmarks
    # Fetch rename Folder key & user from Request
    folderToRenameKey = request.json['key']
    userId = ObjectId(get_jwt_identity())
    renameFolder = request.json['renameFolder']
    docToRename = bookmark_collection.find_one_or_404(
        {
            "key": folderToRenameKey,
            "user_id": userId
        })

    # Rename the Current Folder Node fields
    docToRename['label'] = renameFolder['label']
    docToRename['data'] = renameFolder['data']
    bookmark_collection.update_one(
        {
            "key": folderToRenameKey,
            "user_id": userId,
        }, {"$set": docToRename})
    return jsonify(status="renamed"), 200


@bmarker.route('/deleteFolder', methods=['POST'])
@jwt_required
def deleteFolder():
    user_collection = mongo.db.users
    bookmark_collection = mongo.db.bookmarks
    folderToDelKey = request.json['key']
    userId = ObjectId(get_jwt_identity())
    # Find node to be deleted
    delDoc = bookmark_collection.find_one_or_404(
        {
            "key": folderToDelKey,
            "user_id": userId
        })
    # Delete all children Nodes Recursively
    if(delDoc['leaf'] != True):
        recursiveNodeIter(delDoc, 'delete', b_type="all", itr=len(
            delDoc['children'])-1)
    # Delete Name in Parent Array
    parentNode = bookmark_collection.find_one_or_404(
        {
            "key": delDoc['parent'],
            "user_id": userId
        })
    parentNode['children'].remove(delDoc['key'])
    if len(parentNode['children']) == 0:
        parentNode['leaf'] = True
    bookmark_collection.update_one(
        {
            "_id": ObjectId(parentNode["_id"]),
            "key": delDoc['parent'],
            "user_id": userId
        }, {"$set": parentNode})

    # Delete the Current Node
    bookmark_collection.delete_one({
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


def recursiveNodeIter(node, action, b_type, itr=0, *args, **kwargs):
    bookmark_collection = mongo.db.bookmarks
    while itr >= 0:
        childNode = bookmark_collection.find_one_or_404(
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
                bookmark_collection.delete_one(
                    {'_id': ObjectId(childNode['_id'])})
        else:
            itrChildnode = bookmark_collection.find_one_or_404(
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
                bookmark_collection.delete_one(
                    {
                        "key": nodeToDel['key'],
                        "user_id": node['user_id']
                    })
        itr -= 1
    return node
