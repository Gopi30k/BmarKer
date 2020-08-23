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


def getDependants(node):

    i = 0
    # breakpoint()
    while i < len(node['children']):
        childNode = mongo.db.bookmarks.find_one_or_404(
            {"label": node['children'][i]}, {"_id": 0})

        if childNode['leaf'] == True:
            node['children'][i] = childNode
        else:
            node['children'][i] = getDependants(mongo.db.bookmarks.find_one_or_404(
                {"label": node['children'][i]}, {"_id": 0}))
        i += 1
    return node


def recursiveNodeIter(node, action, *args, **kwargs):
    # print(node, action, kwargs.get('renameTo'))

    i = 0
    # breakpoint()
    while i < len(node['children']):
        childNode = mongo.db.bookmarks.find_one_or_404(
            {"label": node['children'][i]}, {"_id": 0})
        # print(childNode)
        if childNode['leaf'] == True:
            # print('chillll')
            if action == 'fetch':
                node['children'][i] = childNode
            elif action == 'delete':
                # Deleting the Leaf Node
                mongo.db.bookmarks.delete_one({'label': childNode['label']})
            elif action == 'rename':
                # Rename Leaf Node's Parent Name
                newName = kwargs.get('renameTo')
                childNode['parent'] = newName
                # print(childNode)
                mongo.db.bookmarks.update_one(
                    {'label': childNode['label']}, {"$set": childNode})
        else:
            node['children'][i] = recursiveNodeIter(mongo.db.bookmarks.find_one_or_404(
                {"label": node['children'][i]}, {"_id": 0}), action)
        i += 1
    return node


@app.route('/', methods=['GET'])
def getBookmarkTree():
    bookmarkTree = mongo.db.bookmarks.find_one_or_404(
        {"label": "My Bookmarks"}, {"_id": 0})
    recursiveNodeIter(bookmarkTree, 'fetch')
    return jsonify({'data': [bookmarkTree]})


@app.route('/addFolder', methods=['POST'])
def newFolder():
    newDoc = request.json['folder']
    parentDoc = mongo.db.bookmarks.find_one_or_404({"label": newDoc['parent']})
    parentDoc['children'].append(newDoc['label'])
    parentDoc['leaf'] = False
    mongo.db.bookmarks.update_one(
        {'label': parentDoc['label']}, {"$set": parentDoc})
    mongo.db.bookmarks.insert_one(newDoc)
    return jsonify(success="ok"), 200


@app.route('/renameFolder', methods=['POST'])
def renameFolder():
    # Fetch data from Request
    folderToRename = request.json['folder']
    renameString = request.json['renameString']
    print(folderToRename, renameString)
    renameDoc = mongo.db.bookmarks.find_one_or_404(
        {'label': folderToRename['label']}, {"_id": 0})
    # Rename all children node's parent name recusively
    if folderToRename['leaf'] != True:
        recursiveNodeIter(renameDoc, 'rename', renameTo=renameString)

    # Rename in parent's children Array
    parentNode = mongo.db.bookmarks.find_one_or_404(
        {"label": folderToRename['parent']}, {"_id": 0})

    parentNode['children'][parentNode['children'].index(
        folderToRename['label'])] = renameString
    print(parentNode)
    mongo.db.bookmarks.update_one(
        {"label": folderToRename['parent']}, {"$set": parentNode})

    # Rename the Current Node
    oldName = renameDoc['label']
    renameDoc['label'] = renameString
    print(folderToRename)
    mongo.db.bookmarks.update_one(
        {'label': oldName}, {"$set": renameDoc})
    return jsonify(success="ok"), 200


@app.route('/deleteFolder', methods=['POST'])
def deleteFolder():
    folder = request.json['folder']
    delDoc = mongo.db.bookmarks.find_one_or_404(
        {'label': folder['label']}, {"_id": 0})
    # Delete all children Nodes Recursively
    if(delDoc['leaf'] != True):
        recursiveNodeIter(delDoc, 'delete')
    # Delete Name in Parent Array
    parentNode = mongo.db.bookmarks.find_one_or_404(
        {"label": folder['parent']}, {"_id": 0})
    parentNode['children'].remove(folder['label'])
    mongo.db.bookmarks.update_one(
        {"label": folder['parent']}, {"$set": parentNode})

    # Delete the Current Node
    mongo.db.bookmarks.delete_one({'label': folder['label']})
    return jsonify(success="deleted"), 200


if __name__ == "__main__":
    app.run(debug=True)
