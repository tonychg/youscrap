/*
 *  Github/TonyChG
 *  request.js
 *  Description:
**/

const axios = require('axios');
const Logging = require('./logging');
const Request = require('./request');
const url = require('url');

class Scrap {
    constructor (baseUrl, log=true) {
        this.baseUrl = baseUrl;
        this.log = new Logging(log, `${this.host}`);
    }

    get host () {
        return url.parse(this.baseUrl).host;
    }

    async loop () {
        try {
            this.log.display(`Send request to ${this.baseUrl}`);
            const request = new Request(await axios.get(this.baseUrl), this.baseUrl, this.log);
            this.log.display(`Receive status [${request.status}] from ${this.baseUrl}`);

            const links = request.getLinks();
            return request;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Scrap;
