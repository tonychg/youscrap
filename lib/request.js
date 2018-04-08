/*
 *  Github/TonyChG
 *  request.js
 *  Description:
**/

const axios = require('axios');
const Logging = require('./logging');
const Response = require('./response');

class Request {
    constructor (url, log=true) {
        this.url = url;
        this.log = new Logging(log, 'request');
    }

    async send () {
        try {
            this.log.display(`Send request to ${this.url}`);
            const response = new Response(await axios.get(this.url), this.url, this.log);
            this.log.display(`Receive status [${response.status}] from ${this.url}`);

            response.parse()

            return response;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Request;
