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
    let firstNode = website.root;
    if(website.log.file) website.log.writeFile();
    else {
        if(website.log.tree) {
            // website.log.parseTree(firstNode.children);
            website.log.showAsTree(firstNode.children);
        } else website.log.showAsLine(firstNode);
    }
}

module.exports = scrapper;

