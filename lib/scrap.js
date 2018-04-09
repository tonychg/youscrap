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
        this.queue = [];
    }

    get host () {
        return url.parse(this.baseUrl).host;
    }

    get pageUrlPaths () {
        return this.pages.map(page => page.url);
    }

    async start () {
        const mainpage = new Page(this.baseUrl, this.log);
        this.queue.push(mainpage);

        while (this.queue.length) {
            try {
                const activePage = this.queue.pop();
                this.log.display(`Queue ${this.queue.length}`);
                const { page, children } = await activePage.fetch();
                if (!this.pageUrlPaths.includes(activePage.url)) {
                    this.pages.push(activePage);
                }

                if (children.length > 0) {
                    const filterChildren = children.filter(child => {
                        return !this.pageUrlPaths.includes(child.url);
                    });

                    console.log(this.pageUrlPaths)
                    this.queue = this.queue.concat(filterChildren);
                }
            } catch (e) {
                throw e;
            }
        }

        return this.pages;
    }

    showPages () {
        this.log.display(`Find ${this.pages.length} links.`);
        return this.pages.forEach(page => {
            this.log.display(page.url);
        });
    }
}

module.exports = Scrap;
