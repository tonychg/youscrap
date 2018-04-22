/*
 *  Github/TonyChG
 *  main.js
 *  Description:
**/

const Tree = require('./tree');
const format = require('./format');
const Scrapper = require('./scrapper');

module.exports = async (options) => {
    try {
        const tree = new Tree(options.target);
        while (options.depth >= 0) {
            const leafs = tree.getLeafs();

            console.log(`Fetching ${leafs.length} links`)

            let n = 0;
            while (n < leafs.length) {
                console.log(leafs[n].path);
                try {
                    const fullurl = tree.getFullUrl(leafs[n].path);
                    const scrap = new Scrapper(fullurl, tree.host);
                    const links = await scrap.getLinks();
                    links.forEach(link => {
                        const node = tree.access(link);
                        if (!node) {
                            console.log(`New path ${link}`);
                            tree.insertNode(leafs[n], link);
                        } else {
                            node.status = true;
                        }
                    });
                } catch (e) {
                    throw e;
                }
                n++;
            }
            options.depth--;
        }
    } catch (e) {
        throw e;
    }
}
