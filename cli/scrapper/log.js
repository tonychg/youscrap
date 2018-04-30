const colors = require('colors');

function show (website, tree) {
    if(tree){
        lines = [];
        lines.push('/');
        nodes = website.root.children;
        if(nodes.length > 0) paseNodes(nodes);
        lines.forEach( (line) => {
            console.log(line);
        })
    } else {
        // log.info()
        showAsLine(website.root);
    }
}

function paseNodes(nodes, prefix = ''){
    for (let i=0; i < nodes.length; i++) {
        let line = ['', nodes[i].path];
        if (i == nodes.length -1) line[0] = prefix + '└── ';
        else line[0] = prefix + '├── '
        if (!nodes[i].children) {
            lines.push(line[0] + line[1].green)
        }
        else {
            lines.push(line[0] + line[1])
            newPrefix = prefix;
            if (i < nodes.length-1) {
                newPrefix += '│   ';
            }
            else {
                newPrefix += '    ';
            }
            if (i == nodes.length) newPrefix = newPrefix.replace(' ','│');
            paseNodes(nodes[i].children, newPrefix);
        }
    }
}

function showAsLine (node) {
    log.info('url', `${node.url}`);
    if (node.children.length > 0) {
        node.children.forEach(child => {
            showAsLine(child);
        });
    }
}

log = {
    __headerSize: 26, //the size of the header for alignment
    __bodySize: 95,   //the size of the body for aligment
    info: (head, body, foot, file=false) => {
        //Function to Log data
        // header is the log header
        // body is the log body
        // foot is the log foot
        //  file is to log or not in file given
        head = '['.green + head + ']'.green;
        head = head
            .padEnd(log.__headerSize)
            .bold;
        body = body
            .substring(0, log.__bodySize)
            .padEnd(log.__bodySize);
        if(!foot) foot = '';
        else foot = foot.bold;
        console.log(`${head} ${body} ${foot}`);
    },
    time: (time, body, foot) => {
        //Function to Log state
        // time is the log time duration
        // body is the log body
        // foot is the log foot
        //  file is to log or not in file given
        time = time.padEnd(6) + ' ::'.blue;
        time = time
            .bold
            .padEnd(log.__headerSize-1)
        body = body
            .substring(0, log.__bodySize)
            .padEnd(log.__bodySize)
            .italic;
        if(!foot) foot = '';
        console.log(`${time} ${body} ${foot}`);
    },
    state: (head, body, foot) => {
        //Function to Log state
        // header is the log header
        // body is the log body
        // foot is the log foot
        //  file is to log or not in file given
        state = ' ' + '('.grey + state[0] + '/' + content.state[1] + ')'.grey;
        state = state
            .padEnd(log.__headerSize)
            .bold;
        body = body
            .substring(0, log.__bodySize)
            .padEnd(log.__bodySize)
            .italic;
        if(!foot) foot = '';
        console.log(`${state} ${body} ${foot}`);
    },
    error: (head, body, foot, file=false) => {
        //Function to Log warning
        // header is the error type
        // body is the log message
        // foot is the log error code
        //  file is to log or not in file given
        head =  '[' + head + ']'
        head = head
            .red
            .bgBlack
            .padEnd(log.__headerSize)
            .bold;
        body = body
            .substring(0, log.__bodySize)
            .padEnd(log.__bodySize)
            .bold
            .red;
        if(!foot) foot = '';
        else foot = foot.bold.red;
        console.log(`${head} ${body} ${foot}`);
    },
    warn: (body) => {
        //Function to Log warning
        //  body = 'what you would to warn'
        head = '/!\\ WARN '
            .yellow
            .bgBlack
            .padEnd(log.__headerSize)
            .bold;
        body = body
            .substring(0, log.__bodySize)
            .padEnd(log.__bodySize)
            .bold;
        console.log(`${head} ${body}`);
    }
}

module.exports = show;
