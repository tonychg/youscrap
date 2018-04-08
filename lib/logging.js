/*
 *  Github/TonyChG
 *  logging.js
 *  Description:
**/

class Logging {
    constructor (log=true, tagname) {
        this.log = log;
        this.tagname = tagname.toUpperCase();
    }

    get timestamp () {
        const timestamp = new Date();
        const days = timestamp.getDate();
        const months = timestamp.getMonth();

        const date = [
            this.paddZeros(timestamp.getDate()),
            this.paddZeros(timestamp.getMonth()),
            timestamp.getFullYear(),
        ].join('-');

        const time = [
            this.paddZeros(timestamp.getHours()),
            this.paddZeros(timestamp.getMinutes()),
        ].join(':');

        return `${date} ${time}`
    }

    paddZeros(number) {
        if (number < 10) return `0${number}`;
        return number;
    }

    format (message) {
        return `[${this.timestamp}] [${this.tagname}] ${message}\n`;
    }

    display(message, error) {
        if (error) return process.stderr.write(this.format(message));
        if (this.log) return process.stdout.write(this.format(message));
    }
}

module.exports = Logging;
