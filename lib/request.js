/*
 *  Github/TonyChG
 *  response.js
 *  Description:
**/

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
