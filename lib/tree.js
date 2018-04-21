const treeify = require('treeify');
const urlmod = require('url');
const { Page } = require('lib');
const parse5 = require('parse5');
const { spawnSync } = require('child_process');

class TNode {
    constructor (parent, path) {
        this.path = path;
        this.parent = parent;
        this.children = [];
    }

    insertChild (child) {
        this.children.push(child);
    }
}

class Tree {
    constructor (baseurl) {
        this.url = baseurl;
        const { path, protocol, host } = urlmod.parse(this.url);

        this.root = new TNode(null, path)
        this.nodes = [this.root];
        this.protocol = protocol;
        this.host = host;
    }

    getFullUrl (path) {
        const url = urlmod.format({
            protocol: this.protocol,
            host: this.host,
            path: path
        });

        return url;
    }

    extractStaticLinks (page, links=[]) {
        if (page.length > 0) {
            page.forEach(node => {
                if (node.tagName === 'a') {
                    const [href] = node.attrs.filter(attr => attr.name === 'href')
                    if (href && href.value) {
                        const link = href.value.trim();
                        if (link.length > 0) {
                            if (link[0] === '/') {
                                const absoluteLink = `https://${this.host}${link}`;
                                links.push(link);
                            } else {
                                const { host, path } = urlmod.parse(link);
                                if (this.host === host) links.push(path);
                            }
                        }
                    }
                }
            });
            page.map(node => this.extractStaticLinks(node, links));
        } else {
            Object.keys(page).forEach(key => {
                if (key === 'childNodes') {
                    this.extractStaticLinks(page[key], links);
                }
            });
        }
        return links;
    }

    async getStatus (url) {
        const { stdout, err } = spawnSync('curl', [
            '-L',
            '-s',
            '-o',
            '/dev/null',
            '-w',
            '%{http_code}',
            url
        ]);

        if (err) throw err;
        return parseInt(stdout.toString());
    }

    async request (url) {
        try {
            await this.getStatus(url);
            const { stdout, err } = spawnSync('curl', [ '-L', url ]);
            if (err) throw err;
            return this.extractStaticLinks(parse5.parse(stdout.toString()));
        } catch (e) {
            throw e;
        }
    }

    access (path) {
        const search = this.nodes.filter(node => node.path === path);
        if (search.length === 1) {
            return search[0];
        } else {
            return null;
        }
    }

    getLeafs () {
        return this.nodes.filter(node => !node.children.length);
    }

    async get () {
        const leafs = this.getLeafs();

        let n = 0;
        while (n < leafs.length) {
            try {
                const fullurl = this.getFullUrl(leafs[n].path);
                const links = await this.request(fullurl);
                links.forEach(link => {
                    if (!this.access(link)) {
                        const newChild = new TNode(leafs[n], link);
                        this.nodes.push(newChild);
                        leafs[n].insertChild(newChild);
                    }
                });
            } catch (e) {
                throw e;
            }
            n++;
        }
    }
}

module.exports = Tree;
