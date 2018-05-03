/*
 *  Github/TonyChG
 *  index.js
 *  Description:
**/


const url = require('url');
const Website = require('./website');
const log = require('./log');

async function scrapper (baseurl, options) {
    const website = new Website(baseurl, {
        iteration: options.depth,
        log: new log(options.color, options.tree, options.verbose, options.file),
        clear: options.clear
    });
    await website.resolve();
    if(website.log.tree) {
        // website.log.parseTree(firstNode.children);
        website.log.showAsTree(website.root.children);
    } else website.log.showAsLine(website.root);
}

module.exports = scrapper;

