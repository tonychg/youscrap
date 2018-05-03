/*
 *  Github/TonyChG
 *  Github/Dauliac
 *  index.js
 *  Description: The scrapper file that scrap all urls from a website
**/

const url = require('url');
const Website = require('./website');
const log = require('./log');

async function scrapper (baseurl, options) {
    const website = new Website(baseurl, {
        iteration: options.depth,
        log: new log(options.color, options.tree, options.verbose, options.file),
    });
    await website.resolve();
    if(website.log.tree) {
        website.log.showAsTree(website.root.children);
    } else website.log.showAsLine(website.root);
}

module.exports = scrapper;

