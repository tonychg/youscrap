/*
 *  Github/TonyChG
 *  response.js
 *  Description:
**/

const url= require('url');
const path = require('path');

class Response {
    constructor ({ status, statusText, headers, config, request, data }) {
        this.status = status;
        this.statusText = statusText;
        this.headers = headers;
        this.config = config;
        this.request = request;
        this.data = data;
    }

    parse () {
        console.log(this.data);

        return [];
    }
}

module.exports = Response;
