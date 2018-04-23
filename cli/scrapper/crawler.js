/*
 *  Github/TonyChG
 *  crawler.js
 *  Description:
**/

const parse5 = require('parse5');
const url = require('url');
const { spawn } = require('child_process');
const { format } = require('util');
const colors = require('colors');

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
        return format('%fs', seconds).padStart(10);
    }
    log = {
        __headerSize: 32, //the size of the header for alignment
        __bodySize: 95,   //the size of the body for aligment
        info: (content, file=false) => {
            //Function to Log data
            //  content = {header: 'headerData', body: 'bodyData', foot: 'footData'}
            //  file is to log or not in file given
            head = '['.green + content.head + ']'.green;
            head = head
                .padEnd(log.__headerSize)
                .bold;
            body = content.body
                .substring(0, log.__bodySize)
                .padEnd(log.__bodySize);
            foot = content.foot.blue.bold;
            console.log(`${head} ${body} ${foot}`);
        },
        state: (content) => {
            //Function to Log state
            //  content = {header: [state, numberOfState], body: 'bodyData', foot: 'footData'}
            //  file is to log or not in file given
            state = ' ' + '('.grey + content.state[0] + '/' + content.state[1] + ')'.grey;
            state = state
                .padEnd(log.__headerSize)
                .bold;
            body = content.body
                .substring(0, log.__bodySize)
                .padEnd(log.__bodySize)
                .italic;
            foot = content.foot
                .bold;
            console.log(`${state} ${body} ${foot}`);
        },
        error: (content, file=false) => {
            //Function to Log warning
            //  content = {head: 'Type Error', body: 'error message', foot: errorCode}
            head =  '[' + content.head + ']'
            head = head
                .red
                .bgBlack
                .padEnd(log.__headerSize)
                .bold;
            body = content.body
                .substring(0, log.__bodySize)
                .padEnd(log.__bodySize)
                .bold
                .red;
            foot = content.foot
                .bold
                .red;
            console.log(`${head} ${body} ${foot}`);
        },
        warn: (content) => {
            //Function to Log warning
            //  content = 'what you would to warn'
            head = '/!\\ WARN '
                .yellow
                .bgBlack
                .padEnd(log.__headerSize)
                .bold;
            body = content
                .substring(0, log.__bodySize)
                .padEnd(log.__bodySize)
                .bold;
            console.log(`${head} ${body}`);
        }
    }
    isValidHref (href) {
        // Check if the href is a valid one
        if (href && href.value) {
            const link = href.value.trim();
            if (link.length > 0) {
                if (link[0] === '/') {
                    const absoluteLink = `https://${this.host}${link}`;
                    return link;
                } else {
                    const { host, path } = url.parse(link);
                    if (this.host === host) {
                        return path;
                    }
                }
            }
        }
        return null;
    }

    extractLinks (document, links=[]) {
        // document => parse5 Object
        // Recursive search of all href with the same hostname
        if (document.length > 0) {
            document.forEach(node => {
                if (node.tagName === 'a') {
                    const [href] = node.attrs.filter(attr => attr.name === 'href');
                    const link = this.isValidHref(href);
                    link && links.push(link);
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
            this.log('REQUEST', url);
            // setTimeout(() => {
            //     this.log('TIMEOUT', url);
            //     resolve([]);
            // }, 1000 * this.timeout);
            this.request(url).then(body => {
                this.log(this.timedelta(start), url, body.length);
                resolve(this.extractLinks(parse5.parse(body)));
            });
        });
    }

    async resolve () {
        // Push to the queue
        this.urls.forEach(url => this.queue.push(this.getPage(url)));
        this.log('LOG', `Wait until ${this.urls.length} links get resolve.`);
        return await Promise.all(this.queue);
    }
}

module.exports = Crawler;
