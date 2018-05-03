/*
 *  Github/TonyChG
 *  page.js
 *  Description:
**/

const url = require('url');
const parse5 = require('parse5');
const { spawn } = require('child_process');
const log = require('./log');
const { format } = require('util');

class Page {
    constructor (parent, baseurl, log) {
        this.parent = parent;
        this.url = baseurl;
        this.getUrlInfo();
        this.children = [];
        this.status = false;
        this.level = !parent ? 0 : parent.level + 1;
        this.log = log;
    }

    timedelta (begin) {
        return format('%fs', (new Date() - begin) / 1000);
    }

    isValidHref (href) {
        if (!href || !href.value) return null;

        const destUrl = url.resolve(this.url, href.value);
        const destObj = url.parse(destUrl);

        return this.host === destObj.host
            ? destObj.path
            : null
    }

    extractLinks (document, links=[]) {
        if (document.length > 0) {
            document.forEach(node => {
                if (node.tagName === 'a') {
                    const [href] = node.attrs.filter(attr => attr.name === 'href');
                    const link = this.isValidHref(href);
                    if (link && links.indexOf(link) === -1) {
                        links.push(link);
                    }
                }
            })
            document.map(node => this.extractLinks(node, links));
        } else {
            Object.keys(document)
                .filter(key => key === 'childNodes')
                .forEach(key => this.extractLinks(document[key], links));
        }
        return links;
    }

    getUrlInfo () {
        const { host, path } = url.parse(this.url);
        this.host = host;
        this.path = path;
    }

    request () {
        // Curl base http request
        return new Promise(resolve => {
            const curl = spawn('curl', ['-sL', this.url]);
            let output = "";

            curl.stdout.on('data', data => {
                output += data.toString();
            });
            curl.on('close', code => {
                resolve(output);
            });
        });
    }

    async crawl (logging) {
        if (!this.status) {
            const begin = new Date();
            const body = await this.request();
            const links = this.extractLinks(parse5.parse(body))
            if (this.log.verbose) this.log.time(this.timedelta(begin), this.path, links.length, this.clear);
            this.status = true;
            return links;
        }
        return null;
    }
}

module.exports = Page;
