/*
 *  Github/TonyChG
 *  tnode.js
 *  Description:
**/

class TNode {
    constructor (parent, path) {
        this.path = path;
        this.parent = parent;
        this.children = [];
        this.status = false;
    }

    insertChild (child) {
        this.children.push(child);
    }
}

module.exports = TNode;
