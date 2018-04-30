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
        log: options.verbose
    });

    await website.resolve();

    log(website, options.tree);
}

module.exports = scrapper;

