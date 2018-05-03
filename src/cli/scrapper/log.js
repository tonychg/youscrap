const colors = require('colors');
const fs = require('fs/promises');

class log {
    constructor (color, tree, verbose, file){
        this.color = color;
        this.verbose = verbose;
        this.file = file;
        this.lines = [];
        if(tree) this.tree = [];
        this.__headerSize = 26; //the size of the header for alignment
        this.__bodySize = 95;   //the size of the body for aligment
    }

    addLine (line) {
        //Add one line to this;
        this.lines.push(line);
    }

    writeOrLog (line) {
        if (this.file) this.writeLine(line);
        else console.log(line);
    }
    
    async writeLine (line) {
        //Add line in the file
        try {
            await fs.appendFile(this.file, line + '\n');
        } catch (e) {
            throw e;
        }
    }

    parseTree (nodes, prefix = '') {
        for (let i=0; i < nodes.length; i++) {
            let line = ['', nodes[i].path];
            if (i == nodes.length -1) line[0] = prefix + '└── ';
            else line[0] = prefix + '├── '
            if (!nodes[i].children) this.tree.push(line[0] + line[1].green)
            else {
                this.tree.push(line[0] + line[1])
                let newPrefix = prefix;
                if (i < nodes.length-1) {
                    newPrefix += '│   ';
                }
                else newPrefix += '    ';
                if (i == nodes.length) newPrefix = newPrefix.replace(' ','│');
                this.parseTree(nodes[i].children, newPrefix);
            }
        }
    }

    showAsTree (nodes) {
        this.parseTree(nodes)
        this.tree.forEach( (branch) => {
            console.log(branch);
        })
    }

    showAsLine (node) {
        //add parse lines to this;
        this.info('url', `${node.url}`, '');
        if (node.children.length > 0) {
            node.children.forEach(child => {
                this.showAsLine(child);
            });
        }
    }

    info (head, body, foot) {
        //Function to Log data
        // header is the log header
        // body is the log body
        // foot is the log foot
        if (this.color && !this.file) {
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
        let line = `${head} ${body} ${foot}`;
        this.writeOrLog(line);
    }

    time (time, body, foot) {
        //Function to Log state
        // time is the log time duration
        // body is the log body
        // foot is the log foot
        if (this.color && !this.file) {
            time = time.padEnd(6) + ' ::'.blue;
            time = time
                .bold
                .padEnd(log.__headerSize-1)
            body = body
                .substring(0, log.__bodySize)
                .padEnd(log.__bodySize);
        } else {
            time = time + ' ';
            body = body + ' ';
        }

        if (!foot) foot = '';
        let line = `${time} ${body} ${foot}`;
        this.addLine(line);
        this.writeOrLog(line);
    }

    state (state, body, foot) {
        //Function to Log state
        // header is the log header
        // body is the log body
        // foot is the log foot
        if (this.color && !this.file) {
            state = '('.grey + state[0] + '/' + state[1] + ')'.grey;
            state = state
                .padEnd(log.__headerSize)
                .bold;
            body = body
                .substring(0, log.__bodySize)
                .padEnd(log.__bodySize+3);
        } else {
            state = '(' + state[0] + '/' + state[1] + ')';
            body = body;
        }
        if (!foot) foot = '';
        let line = `${state} ${body} ${foot}`;
        this.writeOrLog(line);
    }
}

module.exports = log;
