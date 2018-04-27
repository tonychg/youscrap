/*
 *  Github/TonyChG
 *  main.js
 *  Description:
**/

const scrapper = require('./scrapper');

module.exports = async (options) => {
    try {
        await scrapper(options.url, options);
    } catch (e) {
        console.error(e);
        process.exit(42);
    }
}
