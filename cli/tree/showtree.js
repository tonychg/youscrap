const color = require('colors');

function showTree (tree, showDataEndpoint=false) {
    let lines = []
    paseNodes(tree.nodes, lines, deep=0);
    endPointNumber = tree.getLeafs().length;
    treeDatas = 'url : '.bold + tree.url + '\n' +
        'endPoints : '.bold + endPointNumber//TODO;
    lines.forEach( (line) => {
        console.log(line)
    })
    console.log(treeDatas)
}

function paseNodes(nodes, lines, deep, prefix = ''){
    for (let i=0; i < nodes.length; i++) {
        let line = ['', nodes[i]['path']];
        if (i == nodes.length -1) line[0] = prefix + '└── ';
        else line[0] = prefix + '├── '
        if (!nodes[i]['children'].length) {
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
            paseNodes(nodes[i].children, lines, deep++, newPrefix);
        }
    }
}

module.exports = showTree;
