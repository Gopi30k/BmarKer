from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
import uuid
import bcrypt
bmarker = Blueprint('bmarker', __name__)
mongo = PyMongo(bmarker)


@bmarker.route('/', methods=['GET'])
def index():
    return "hello"


@bmarker.route('/signup', methods=['POST'])
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
        return jsonify(error="EmailId already exists"), 400
