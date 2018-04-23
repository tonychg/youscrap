const tree = {
  url: 'http://google.com',
  root:
   {
     path: '/',
     parent: null,
     children:
      [ ['TNode'],
        ['TNode'],
        ['TNode'] ] },
  nodes:
   [ { path: '/', parent: null, children: [] },
     {
       path: '/preferences?hl=fr',
       parent: ['TNode'],
       children: [] },
     {
       path: '/search?site=&ie=UTF-8&q=Journ%C3%A9e+de+la+Terre&oi=ddle&ct=earth-day-2018-6526947692642304&hl=fr&kgmid=/m/014xqm&sa=X&ved=0ahUKEwiQ2MfL-svaAhWBXBQKHaU_DF0QPQgD',
       parent: ['TNode'],
       children: [] },
     {
       path: '/advanced_search?hl=fr&authuser=0',
       parent: ['TNode'],
       children: [] },
     {
       path: '/language_tools?hl=fr&authuser=0',
       parent: ['TNode'],
       children: [] },
     { path: '/intl/fr/ads/', parent: ['TNode'], children: [] },
     { path: '/services/', parent: ['TNode'], children: [] },
     {
       path: '/intl/fr/about.html',
       parent: ['TNode'],
       children: [
           { path: '/intl/fr/ads/', parent: ['TNode'], children: [] },
            { path: '/services/', parent: ['TNode'], children: [] }]
    },     
    { path: '/intl/fr/about.html',
       parent: ['TNode'],
       children: [
           { path: '/intl/fr/ads/', parent: ['TNode'], children: [
                { path: '/intl/fr/ads/', parent: ['TNode'], children: [] },
           ] },
            { path: '/services/', parent: ['TNode'], children: [
                { path: '/intl/fr/ads/', parent: ['TNode'], children: [] },
                { path: '/intl/fr/ads/', parent: ['TNode'], children: [
                    { path: '/intl/fr/ads/', parent: ['TNode'], children: [] },
                    { path: '/intl/fr/ads/', parent: ['TNode'], children: [] },
                    { path: '/intl/fr/ads/', parent: ['TNode'], children: [] }
                ] },
                { path: '/intl/fr/ads/', parent: ['TNode'], children: [] }
            ] }]
    },
    {
       path: '/advanced_search?hl=fr&authuser=0',
       parent: ['TNode'],
       children: [] }
   ]
}

const color = require('colors');

function showTree (tree, showDataEndpoint=false) {
    let lines = []
    paseNodes(tree.nodes, lines);
    treeDatas = 'url : '.bold + tree.url + '\n' +
        'endPoints : '.bold + '2';
    console.log(treeDatas)
    lines.forEach( (line) => {
        console.log(line)
    })
}

function paseNodes(nodes, lines, deep = 0, prefix = ''){
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
            paseNodes(nodes[i].children, lines, deep+1, newPrefix);
        }
    }
}

showTree(tree);


