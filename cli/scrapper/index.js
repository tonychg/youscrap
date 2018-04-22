/*
 *  Github/TonyChG
 *  index.js
 *  Description:
**/

const urlmod = require('url');
const { spawnSync } = require('child_process');
const parse5 = require('parse5');

class Scrapper {
    constructor (url, host) {
        this.url = url;
        this.links = [];
        this.host = host;
    }

    extractStaticLinks (page, links=[]) {
        if (page.length > 0) {
            page.forEach(node => {
                if (node.tagName === 'a') {
                    const [href] = node.attrs.filter(attr => attr.name === 'href')
                    if (href && href.value) {
                        const link = href.value.trim();
                        if (link.length > 0) {
                            if (link[0] === '/') {
                                const absoluteLink = `https://${this.host}${link}`;
                                links.push(link);
                            } else {
                                const { host, path } = urlmod.parse(link);
                                if (this.host === host) links.push(path);
                            }
                        }
                    }
                }
            });
            page.map(node => this.extractStaticLinks(node, links));
        } else {
            Object.keys(page).forEach(key => {
                if (key === 'childNodes') {
                    this.extractStaticLinks(page[key], links);
                }
            });
        }
        return links;
    }

    async getStatus (url) {
        const { stdout, err } = spawnSync('curl', [
            '-L',
            '-s',
            '-o',
            '/dev/null',
            '-w',
            '%{http_code}',
            url
        ]);

        if (err) throw err;
        return parseInt(stdout.toString());
    }

    async getLinks () {
        try {
            await this.getStatus(this.url);
            const { stdout, err } = spawnSync('curl', [ '-L', this.url ]);
            if (err) throw err;
            return this.extractStaticLinks(parse5.parse(stdout.toString()));
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Scrapper;
