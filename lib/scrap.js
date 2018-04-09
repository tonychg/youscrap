/*
 *  Github/TonyChG
 *  request.js
 *  Description:
**/

const axios = require('axios');
const Logging = require('./logging');
const Page = require('./page');
const url = require('url');

class Scrap {
    constructor (baseUrl, log=true) {
        this.baseUrl = baseUrl;
        this.log = new Logging(log, `${this.host}`);
        this.pages = [];
    }

    get host () {
        return url.parse(this.baseUrl).host;
    }

    isAnyPage () {
        return this.pages.filter(page => page.state === 0).length > 0;
    }

    addNewPages (pages) {
        pages.forEach(page => {
            if (this.pages.indexOf(page) === -1) {
                this.pages.push(page);
            }
        });
    }

    async loop () {
        try {
            const mainpage = new Page(this.baseUrl, this.log);
            this.pages.push(mainpage);
            const childPages = await mainpage.get();

            childPages.forEach(childPage => {
                if (this.pages.indexOf(childPage) === -1) {
                    this.pages.push(childPage);
                }
            });

            while (this.isAnyPage()) {
                const childs = await Promise.all(this.pages
                    .filter(page => page.state === 0)
                    .map(page => page.get())
                );
                this.addNewPages(childs
                    .filter(child => typeof(child !== 'undefined'))
                    .map(child => child.map(childurl => new Page(childurl, this.log)))
                );
            }

            return;
        } catch (e) {
            throw e;
        }
    }

    showPages () {
        this.log.display(`Find ${this.pages.length} links.`);
        return this.pages.forEach(page => {
            this.log.display(page.url);
        });
    }
}

module.exports = Scrap;
