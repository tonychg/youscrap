/*
 *  Github/TonyChG
 *  Github/Dauliac
 *  page.js
 *  Description: The main file that lauch the cli
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
