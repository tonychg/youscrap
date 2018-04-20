/*
 *  Github/TonyChG
 *  request.js
 *  Description:
**/

const axios = require('axios');
const Logging = require('./logging');
const Page = require('./page');
const url = require('url');
const Tree = require('./tree')

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

    get pageUrls () {
        return this.pages.map(page => page.url);
    }

    get queueUrls () {
        return this.queue.map(page => page.url);
    }

    async fetchQueue () {
        const cacheQueue = this.queue.map(page => page.fetch());
        this.queue = [];

        this.log.display(`Fetching ${cacheQueue.length} links`);
        try {
            const resolveQueue = await Promise.all(cacheQueue);
            for (let i = 0; i < resolveQueue.length; i++) {
                const { page, children } = resolveQueue[i];
                !this.pageUrls.includes(page.url) && this.pages.push(page);
                if (children.length > 0) {
                    children.forEach(child => {
                        if (!this.pageUrls.includes(child.url)
                            && !this.queueUrls.includes(child.url)) {
                            this.queue.push(child);
                        }
                    });
                }
            }
        } catch (e) {
            throw e;
        }
        return this.queue.length;
    }

    async start (depth) {
        const mainpage = new Page(this.baseUrl, this.log);
        this.queue.push(mainpage);

        let step = 0;
        while (step < depth && this.queue.length > 0) {
            try {
                this.log.display(`Fetch level ${step}`);
                await this.fetchQueue();
                step++;
            } catch (e) {
                throw e;
            }
        }
        this.pages = this.pages.concat(this.queue);
        return this.pages;
    }

    showPages () {
        this.log.display(`Find ${this.pages.length} links.`);
        let tree = new Tree()
        this.pages.forEach(page => {
            if(page != this.pages[0])
                tree.addPage(page.urlInfo.path)
        });
        return tree.showTree()
    }
}

module.exports = Scrap;
