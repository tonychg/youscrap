const colors = require('colors');

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

function showAsLine (node, clear) {
    log.info('url', `${node.url}`, '', clear);
    if (node.children.length > 0) {
        node.children.forEach(child => {
            showAsLine(child, clear);
        });
    }
}

log = {
    __headerSize: 26, //the size of the header for alignment
    __bodySize: 95,   //the size of the body for aligment
    show: (website, tree, clear) => {
        if (tree) {
            lines = [];
            lines.push('/');
            nodes = website.root.children;
            if (nodes.length > 0) paseNodes(nodes);
            lines.forEach( (line) => {
                console.log(line);
            })
        } else {
        showAsLine(website.root, clear);
        }
    },
    info: (head, body, foot, clear=false) => {
        //Function to Log data
        // header is the log header
        // body is the log body
        // foot is the log foot
        if (!clear) {
            head = '['.green + head + ']'.green;
            head = head
                .padEnd(log.__headerSize)
                .bold;
            body = body
                .substring(0, log.__bodySize)
                .padEnd(log.__bodySize);
        } else {
            head = '';
            body = body + ' ';
        }
        if (!foot) foot = ''
        else foot = foot.bold;
        console.log(`${head} ${body} ${foot}`);
    },
    time: (time, body, foot, clear=false) => {
        //Function to Log state
        // time is the log time duration
        // body is the log body
        // foot is the log foot
        if (!clear) {
            time = time.padEnd(6) + ' ::'.blue;
            time = time
                .bold
                .padEnd(log.__headerSize-1)
            body = body
                .substring(0, log.__bodySize)
                .padEnd(log.__bodySize)
                .italic;
        } else {
            time = time + ' ';
            body = body + ' ';
        }

        if (!foot) foot = '';
        console.log(`${time} ${body} ${foot}`);
    },
    state: (head, body, foot, clear=false) => {
        //Function to Log state
        // header is the log header
        // body is the log body
        // foot is the log foot
        if (!clear) {
            state = '('.grey + head[0] + '/' + head[1] + ')'.grey;
            state = state
                .padEnd(log.__headerSize)
                .bold;
            body = body
                .substring(0, log.__bodySize)
                .padEnd(log.__bodySize+3)
                .italic;
        } else {
            state = '(' + head[0] + '/' + head[1] + ')';
            body = body;
        }
        if (!foot) foot = '';
        console.log(`${state} ${body} ${foot}`);
    },
    warn: (body, clear=false) => {
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

module.exports = log;
