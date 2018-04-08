/*
 *  Github/TonyChG
 *  response.js
 *  Description:
**/

const parse5 = require('parse5');
const url = require('url');
const { URL } = require('url');

class Response {
    constructor ({ status, statusText, headers, config, data }, baseUrl, log) {
        this.status = status;
        this.statusText = statusText;
        this.headers = headers;
        this.config = config;
        this.data = data;
        this.log = log;
        this.baseUrl = baseUrl;
    }

    loop (parent, links=[]) {
        if (parent && parent.tagName === 'a') {
            const [link] = parent.attrs.filter(attr => attr.name === 'href')
            if (link.value.trim().length > 0) {
                links.push(link.value.trim());
            }
        }
        if (parent.length > 0) {
            for (let index in parent) {
                this.loop(parent[index], links);
            }
        } else {
            for (let prop in parent) {
                if (Array.isArray(parent[prop])) {
                    this.loop(parent[prop], links);
                }
            }
        }
        return links;
    }

    async parse () {

        const document = parse5.parse(this.data);
        const links = this.loop(document);

        const internalLinks = links.filter(link => link[0] === '/');
        const externalLinks = links.filter(link => internalLinks.indexOf(link) === -1);

        externalLinks.forEach(link => {
            const newUrl = url.parse(link);
            if (newUrl.host === this.baseUrl.host) {
                internalLinks.push(link);
                externalLinks.splice(externalLinks.indexOf(link), 1);
            }
        });

        this.log.display(`-> ${internalLinks.length} internal Links`);
        internalLinks.forEach(link => {
            this.log.display(link);
        })
        this.log.display(`-> ${externalLinks.length} external Links`);
        externalLinks.forEach(link => {
            this.log.display(link);
        })
        return [];
    }
}

module.exports = Response;
