/*
 *  Github/TonyChG
 *  link.js
 *  Description:
**/

const url = require('url');
const parse5 = require('parse5');
const { spawnSync } = require('child_process');

class Page {
    constructor (link, log) {
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

    async getStatus () {
        const { stdout, err } = spawnSync('curl', [
            '-L',
            '-s',
            '-o',
            '/dev/null',
            '-w',
            '%{http_code}',
            this.url
        ]);

        if (err) throw err;
        this.status = parseInt(stdout.toString());
        return this.status;
    }

    async request () {
        try {
            await this.getStatus();
            const { stdout, err } = spawnSync('curl', [ '-L', this.url ]);
            if (err) throw err;
            return stdout.toString();
        } catch (e) {
            throw e;
        }
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
                                const absoluteLink = `https://${this.host}${link}`;
                                links.push(absoluteLink);
                            } else {
                                const { host } = url.parse(link);
                                if (this.host === host) links.push(link);
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
            const data = await this.request();

            this.log.display(`Receive status [${this.status}] from ${this.url}`);
            if (!data) throw 'No data';

            this.children = this.extractStaticLinks(parse5.parse(data));
            this.children = this.children.map(link => new Page(link, this.log));

            this.log.display(`Find ${this.children.length} links in ${this.urlInfo.path}`);

            return { page: this, children: this.children };
        } catch (e) {
            return { page: this, children: [] };
        }
    }
}

module.exports = Page;
