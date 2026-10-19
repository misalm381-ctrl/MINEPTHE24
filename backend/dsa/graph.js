/**
 * Graph Adjacency List for Academic Department & Book Connectivity
 * Academic DSA Module (Node.js & C equivalent)
 */

class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }

    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, new Set());
        }
    }

    addEdge(source, destination) {
        this.addVertex(source);
        this.addVertex(destination);
        this.adjacencyList.get(source).add(destination);
        this.adjacencyList.get(destination).add(source);
    }

    getNeighbors(vertex) {
        if (!this.adjacencyList.has(vertex)) return [];
        return Array.from(this.adjacencyList.get(vertex));
    }

    bfs(startVertex) {
        const visited = new Set();
        const queue = [startVertex];
        const result = [];

        visited.add(startVertex);

        while (queue.length > 0) {
            const current = queue.shift();
            result.push(current);

            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }

        return result;
    }
}

module.exports = { Graph };
