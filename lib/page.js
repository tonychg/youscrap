/*
 *  Github/TonyChG
 *  link.js
 *  Description:
**/

const url = require('url');
const parse5 = require('parse5');
const axios = require('axios');

const READY = 0;
const PENDING = 1;
const PARSING = 2;
const END = 3;
const NOT_FOUND = 4;

class Page {
    constructor (link, log) {
        console.log(`--> ${link}`)
        if (link[link.length-1] === '/') {
            link = link.slice(0, link.length-1);
        }
        this.url = link;
        this.urlInfo = url.parse(link);
        this.children = [];
        this.status = 0;
        this.log = log;
    }

    get host () {
        return this.urlInfo.host;
    }

    extractStaticLinks (parent, links=[]) {
        if (parent.length > 0) {
            parent.forEach(node => {
                if (node.tagName === 'a') {
                    const [href] = node.attrs.filter(attr => attr.name === 'href')
                    if (href && href.value) {
                        const link = href.value.trim();
                        const { host } = url.parse(link);
                        if (link.length > 0 && this.host === host) {
                            if (link[0] === '/') {
                                const absoluteLink = `https://${this.host}${link}`;
                                links.push(absoluteLink);
                            } else {
                                links.push(link);
                            }
                        }
                    }
                }
            });
            parent.map(node => this.extractStaticLinks(node, links));
        } else {
            Object.keys(parent).forEach(key => {
                if (key === 'childNodes') {
                    this.extractStaticLinks(parent[key], links);
                }
            });
        }
        return links;
    }

    async fetch () {
        try {
            this.log.display(`Send request to ${this.url}`);
            const { status, data } = await axios.get(this.url);
            this.status = status;

            this.log.display(`Receive status [${status}] from ${this.url}`);
            if (!data || status !== 200) throw 'No data';

            this.children = this.extractStaticLinks(parse5.parse(data));
            this.children = this.children.map(link => new Page(link, this.log));

            this.log.display(`Find ${this.children.length} links in ${this.urlInfo.path}`);

            return { page: this, children: this.children };
        } catch (e) {
            this.status = 999;
            return { page: this, children: [] };
        }
    }
}

module.exports = Page;
