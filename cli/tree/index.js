/*
 *  Github/TonyChG
 *  index.js
 *  Description:
**/

const TNode = require('./tnode');
const urlmod = require('url');

class Tree {
    constructor (baseurl) {
        this.url = baseurl;
        const { path, protocol, host } = urlmod.parse(this.url);

        this.root = new TNode(null, path)
        this.nodes = [this.root];
        this.protocol = protocol;
        this.host = host;
    }

    getFullUrl (path) {
        const url = urlmod.format({
            protocol: this.protocol,
            host: this.host,
            pathname: path
        });

        return url;
    }

    access (path) {
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            if (node.path === path) {
                return true;
            }
        }
        return false;
    }

    insertNode (parent, path) {
        const childNode = new TNode(parent, path);
        this.nodes.push(childNode);
        parent.insertChild(childNode);
    }

    getLeafs () {
        return this.nodes.filter(node => !node.children.length && !node.status);
    }
}

module.exports = Tree;

