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
        log: options.verbose,
        clear: options.clear
    });
    await website.resolve();
    log.show(website, options.tree, options.clear);
}

module.exports = scrapper;

