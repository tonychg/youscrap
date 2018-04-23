/*
 *  Github/TonyChG
 *  index.js
 *  Description:
**/

const urlmod = require('url');
const { spawnSync } = require('child_process');
const parse5 = require('parse5');
const https = require('follow-redirects').https;

function isValidHref (href, host) {
    // Check if the href is a valid one
    if (href && href.value) {
        const link = href.value.trim();
        if (link.length > 0) {
            if (link[0] === '/') {
                const absoluteLink = `https://${this.host}${link}`;
                return link;
            } else {
                const { host, path } = urlmod.parse(link);
                if (this.host === host) {
                    return path;
                }
            }
        }
    }
    return null;
}

function extractLinks (host, document, links=[]) {
    // document => parse5 Object
    // Recursive search of all href with the same hostname
    if (document.length > 0) {
        document.forEach(node => {
            if (node.tagName === 'a') {
                const [href] = node.attrs.filter(attr => attr.name === 'href');
                const link = isValidHref(href, host);
                link && links.push(link);
            }
        })
        document.map(node => extractLinks(host, node, links));
    } else {
        Object.keys(document)
            .filter(key => key === 'childNodes')
            .forEach(key => extractLinks(host, document[key], links));
    }
    return links;
}

async function requestPage (host, url) {
    console.log(`Request url => ${url}`);
    const { error, stdout } = spawnSync('curl', ['-sL', url]);
    if (error) return null;
    const body = stdout.toString();
    return extractLinks(host, parse5.parse(body));
}

async function requestAllPage (tree) {
    const leafs = tree.getLeafs();
    const urls = leafs.map(leaf => tree.getFullUrl(leaf.path));
    const requests = [];

    urls.forEach(url => {
        requests.push(requestPage(tree.host, url));
    });

    const results = await Promise.all(requests);
    results.forEach((links, id) => {
        if (links) {
            const newLinks = links.filter(link => !tree.access(link));
            newLinks.forEach(link => {
                tree.insertNode(leafs[id], link);
                console.log(`Insert new node ${link}`);
            });
        }
        leafs[id].status = true;
    });
    return tree;
}

module.exports = { extractLinks, requestPage, requestAllPage };

