/*
 *  Github/TonyChG
 *  index.js
 *  Description:
**/

const Crawler = require('./crawler');

async function requestAllPage (tree) {
    const leafs = tree.getLeafs();
    if (!leafs.length) throw 'No links.';

    const urls = leafs.map(leaf => tree.getFullUrl(leaf.path));
    const results = await new Crawler(tree.host, urls).resolve();
    results.forEach((links, id) => {
        if (links) {
            const newLinks = links.filter(link => !tree.access(link));
            newLinks.forEach(link => {
                tree.insertNode(leafs[id], link);
            });
        }
        leafs[id].status = true;
    });
    return tree;
}

module.exports = { requestAllPage };

