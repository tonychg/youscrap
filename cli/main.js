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

            let n = 0;
            console.log(`Fetching ${leafs.length} links`)
            while (n < leafs.length) {
                console.log(leafs[n].path);
                try {
                    const fullurl = tree.getFullUrl(leafs[n].path);
                    const scrap = new Scrapper(fullurl);
                    const links = await scrap.getLinks();
                    links.forEach(link => {
                        tree.insertNode(leafs[n], link);
                    });
                } catch (e) {
                    throw e;
                }
                n++;
            }
            options.depth--;
        }

        console.log(tree);
    } catch (e) {
        throw e;
    }
}
