/*
 *  Github/TonyChG
 *  index.js
 *  Description:
**/


const url = require('url');
const Website = require('./website');

async function scrapper (baseurl, options) {
    const website = new Website(baseurl, {
        iteration: options.depth,
        log: options.verbose
    });

    await website.resolve();

    website.show(null, options.tree);
}

module.exports = scrapper;

