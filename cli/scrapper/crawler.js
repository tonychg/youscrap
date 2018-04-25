/*
 *  Github/TonyChG
 *  crawler.js
 *  Description:
**/

const parse5 = require('parse5');
const url = require('url');
const { spawn } = require('child_process');
const { format } = require('util');
const log = require('./log');

// Crawl all href from all urls with timeout check from the same host source
class Crawler {
    constructor (host, urls, timeout=20) {
        this.host = host;
        this.urls = urls;
        this.timeout = timeout;
        this.queue = [];
    }

    timedelta(start) {
        const seconds = (new Date() - start) / 1000;
        return format('%fs', seconds);
    }

    isValidHref (pageUrl, href) {
        if (!href || !href.value) return null;
        const destUrl = url.resolve(pageUrl, href.value);
        const destObj = url.parse(destUrl);
        if (this.host === destObj.host) {
            return destObj.path;
        }
        return null;
    }

    extractLinks (pageUrl, document, links=[]) {
        // document => parse5 Object
        // Recursive search of all href with the same hostname
        if (document.length > 0) {
            document.forEach(node => {
                if (node.tagName === 'a') {
                    const [href] = node.attrs.filter(attr => attr.name === 'href');
                    const link = this.isValidHref(pageUrl, href);
                    link && links.push(link);
                }
            })
            document.map(node => this.extractLinks(pageUrl, node, links));
        } else {
            Object.keys(document)
                .filter(key => key === 'childNodes')
                .forEach(key => this.extractLinks(pageUrl, document[key], links));
        }
        return links;
    }

    request (url) {
        // Curl base http request
        return new Promise(resolve => {
            const curl = spawn('curl', ['-sL', url]);
            let output = "";

            curl.stdout.on('data', data => {
                output += data.toString();
            });
            curl.on('close', code => {
                resolve(output);
            });
        });
    }

    getPage (url) {
        return new Promise(resolve => {
            const start = new Date();
            log.info('REQUEST', url);
            // setTimeout(() => {
            //     this.log('TIMEOUT', url);
            //     resolve([]);
            // }, 1000 * this.timeout);
            this.request(url).then(body => {
                log.time(this.timedelta(start), url, body.length);
                resolve(this.extractLinks(url, parse5.parse(body)));
            });
        });
    }

    async resolve () {
        // Push to the queue
        this.urls.forEach(url => this.queue.push(this.getPage(url)));
        log.info('LOG', `Wait until ${this.urls.length} links get resolve.`);
        return await Promise.all(this.queue);
    }
}

module.exports = Crawler;
