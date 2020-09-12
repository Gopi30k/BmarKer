from flask import Flask
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request
from flask_pymongo import PyMongo
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['DB_NAME'] = 'projects'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/projects'

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


@app.route('/', methods=['POST', 'GET'])
def getBookmarkTree():
    if request.method == 'POST':
        bookmarkTree = mongo.db.bookmarks.find_one_or_404(
            {"key": request.json['bookmark']}, {"_id": 0})
    else:
        bookmarkTree = mongo.db.bookmarks.find_one_or_404(
            {"key": "5e9a7e56-858b-4cc8-be8b-14ad6d1801a8"}, {"_id": 0})
    recursiveNodeIter(bookmarkTree, 'fetch')
    return jsonify({'data': [bookmarkTree]})


@app.route('/addFolder', methods=['POST'])
def newFolder():
    newDoc = request.json['folder']
    parentDoc = mongo.db.bookmarks.find_one_or_404({"key": newDoc['parent']})
    parentDoc['children'].append(newDoc['key'])
    parentDoc['leaf'] = False
    mongo.db.bookmarks.update_one(
        {'key': parentDoc['key']}, {"$set": parentDoc})
    mongo.db.bookmarks.insert_one(newDoc)
    return jsonify(success="ok"), 200


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
    return jsonify(success="ok"), 200


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
    return jsonify(success="deleted"), 200


if __name__ == "__main__":
    app.run(debug=True)
