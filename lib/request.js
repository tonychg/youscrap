/*
 *  Github/TonyChG
 *  response.js
 *  Description:
**/

const parse5 = require('parse5');
const url = require('url');
const { URL } = require('url');

class Request {
    constructor ({ status, data }, baseUrl, log) {
        this.status = status;
        this.data = data;
        this.log = log;
        this.baseUrl = baseUrl;

        this.links = [];
        this.alreadyRequest = [];
    }

    get host () {
        return url.parse(this.baseUrl).host;
    }

    extractStaticLinks (parent, links=[]) {
        if (parent.length > 0) {
            parent.forEach(node => {
                if (node.tagName === 'a') {
                    const [href] = node.attrs.filter(attr => attr.name === 'href')
                    const link = href.value.trim();
                    if (link.length > 0) {
                        if (link[0] === '/') {
                            links.push(`${this.baseUrl}${link}`);
                        } else {
                            links.push(link);
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

    show_links() {
        this.log.display(`-> ${this.links.length} Links`);
        this.links.forEach(link => {
            this.log.display(link)
        });
    }

    getLinks () {
        this.links = this.extractStaticLinks(parse5.parse(this.data));
        this.show_links();
        return this.links;
    }
}

module.exports = Request;
