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
        this.url = link;
        this.childUrls = [];
        this.state = READY;
        this.log = log;
    }

    get host () {
        return url.parse(this.url).host;
    }

    extractStaticLinks (parent, links=[]) {
        if (parent.length > 0) {
            parent.forEach(node => {
                if (node.tagName === 'a') {
                    const [href] = node.attrs.filter(attr => attr.name === 'href')
                    if (href && href.value) {
                        const link = href.value.trim();
                        if (link.length > 0) {
                            if (link[0] === '/') {
                                links.push(`${this.url}${link}`);
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
        return links.filter(link => url.parse(link).host === this.host);
    }

    async get () {
        try {
            this.log.display(`Send request to ${this.url}`);
            this.state = PENDING;
            const { status, data } = await axios.get(this.url);
            this.log.display(`Receive status [${status}] from ${this.url}`);
            if (status !== 200) {
                this.state = NOT_FOUND;
                return status;
            }
            this.state = PARSING;
            this.childUrls = this.extractStaticLinks(parse5.parse(data));

            // this.log.display('\n    ->'+this.childUrls.join('\n    ->'));

            return this.childUrls;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

module.exports = Page;
