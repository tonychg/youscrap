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
            path: path
        });

        return url;
    }

    access (path) {
        const search = this.nodes.filter(node => node.path === path);
        if (search.length === 1) {
            return search[0];
        } else {
            return null;
        }
    }

    insertNode (parent, path) {
        if (!this.access(path)) {
            const childNode = new TNode(parent, path);
            parent.insertChild(childNode);
            this.nodes.push(childNode);
        }
    }

    getLeafs () {
        return this.nodes.filter(node => !node.children.length);
    }

}

module.exports = Tree;

