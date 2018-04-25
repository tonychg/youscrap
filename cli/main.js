/*
 *  Github/TonyChG
 *  main.js
 *  Description:
**/

const Tree = require('./tree');
const { requestAllPage } = require('./scrapper');

module.exports = async (options) => {
    // console.log('deep : ' + options.depth);
    // console.log('tree : ' + options.tree);
    const tree = new Tree(options.url);
    do {
        try {
            await requestAllPage(tree);
        } catch (e) {
            console.error(e);
            process.exit(42);
        }
        options.depth--;
    } while (options.depth > 0);
    
    if(options.tree === 'true'){
        tree.showTree();
    }
}
