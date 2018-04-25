/*
 *  Github/TonyChG
 *  log.js
 *  Description:
**/

const colors = require('colors');

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
        //  content.state = [curr, total]
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

module.exports = log;
