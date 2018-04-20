const treeify = require('treeify');

class Tree {
    constructor () {
        this.treePages = {}
    }

    addPage (page) {
        page = page.split("?")[0]
        .split("/");
        let currentLevel = this.treePages
        delete page[0]; // undefine fist element ''
        page = page.filter(n => !undefined); // remove undefined element
        page.forEach( endPoint => {
            currentLevel[endPoint] = {}
            this.treePages[currentLevel]
            currentLevel = currentLevel[endPoint]
        })
    }

    showTree () {
        console.log(treeify.asTree(this.treePages));
    }
}

module.exports = Tree;
