/*
 *  Github/TonyChG
 *  website.js
 *  Description:
**/

const Page = require('./page.js')
const url = require('url');
const log = require('./log.js')

class Website {
    constructor (baseurl, { iteration, log}) {
        this.log = log;
        this.root = new Page(null, baseurl, this.log);
        this.nodes = [this.root];
        this.maxIter = iteration;
        this.chunkSize = 50;
    }

    isInTree (path) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].path === path) {
                return true;
            }
        }
        return false;
    }

    getLeafs (node, leafs=[]) {
        if (!node) node = this.root;
        if (!node.status) {
            leafs.push(node);
        }
        if (node.children.length > 0) {
            node.children.forEach(child => {
                this.getLeafs(child, leafs);
            })
        }
        return leafs;
    }

    async resolveQueue () {
        const leafs = this.getLeafs();
        const queue = [];

        if (leafs.length > this.chunkSize) {
            const chunkCount = Math.ceil(leafs.length / this.chunkSize, 1);
            for (let i = 0; i < chunkCount; i++) {
                const start = i * this.chunkSize;
                const end = i+1 === chunkCount ? leafs.length : start + this.chunkSize;
                queue.push(leafs.slice(start, end));
            }
        } else {
            queue.push(leafs);
        }

        let leafId = 0;
        for (let step = 0; step < queue.length; step++) {
            if (queue.length > 1 && this.log) {
                log.state([step+1, queue.length], 'Stagging', 'OK', this.clear);
            }
            const results = await Promise.all(queue[step].map(leaf => leaf.crawl()));

            results.forEach(links => {
                if (links !== null) {
                    links.forEach(link => {
                        if (!this.isInTree(link)) {
                            const parent = leafs[leafId];
                            const nodeUrl = url.resolve(parent.url, link);
                            const newNode = new Page(parent, nodeUrl, this.log);
                            parent.children.push(newNode);
                            this.nodes.push(newNode);
                        }
                    })
                }
                leafId++;
            });
        }
    }

    async resolve () {
        for (let i = 0; i < this.maxIter; i++) {
            await this.resolveQueue();
        }
    }
}

module.exports = Website;
