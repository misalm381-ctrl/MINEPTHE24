const express = require("express");
const { pool } = require("../config/db");
const { findNearestCollectionPoint } = require("../dsa/dijkstra");
const { PriorityQueue } = require("../dsa/priority_queue");
const { Graph } = require("../dsa/graph");
const { HashTable } = require("../dsa/hash_table");
const { mergeSortByMatchScore, binarySearchById } = require("../dsa/search_sort");

const router = express.Router();

// 1. Dijkstra: Find Nearest Collection Point
router.post("/dijkstra", async (req, res) => {
    try {
        const { latitude = 18.5204, longitude = 73.8567 } = req.body;

        const [points] = await pool.execute(
            "SELECT id, name, address, latitude, longitude, contact_person FROM collection_points"
        );

        const result = findNearestCollectionPoint({ latitude, longitude }, points);

        res.json({
            success: true,
            algorithm: "Dijkstra Shortest Path",
            userCoordinates: { latitude, longitude },
            result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. Priority Queue: Academic Need Priority Simulation
router.post("/priority-queue", async (req, res) => {
    try {
        const pq = new PriorityQueue();
        const sampleRequests = req.body.requests || [
            { id: 101, student: "Alice", semesterUrgency: 4, reputation: 20 },
            { id: 102, student: "Bob", semesterUrgency: 1, reputation: 50 },
            { id: 103, student: "Charlie", semesterUrgency: 5, reputation: 35 }
        ];

        sampleRequests.forEach((reqItem) => {
            // Priority formula: urgency * 10 + reputation
            const score = (reqItem.semesterUrgency || 1) * 10 + (reqItem.reputation || 0);
            pq.enqueue(reqItem, score);
        });

        const servedOrder = [];
        while (pq.size() > 0) {
            servedOrder.push(pq.dequeue());
        }

        res.json({
            success: true,
            algorithm: "Binary Max-Heap Priority Queue",
            servedOrder
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. Graph: Department & Book Relationship Network
router.get("/graph", async (req, res) => {
    try {
        const [books] = await pool.execute("SELECT id, title, department, subject FROM books LIMIT 30");

        const graph = new Graph();

        books.forEach((b) => {
            const dept = b.department || "General Engineering";
            const subj = b.subject || "Electives";
            graph.addEdge(dept, subj);
            graph.addEdge(subj, b.title);
        });

        const departments = [...new Set(books.map((b) => b.department || "General Engineering"))];
        const graphData = {};

        departments.forEach((d) => {
            graphData[d] = graph.bfs(d);
        });

        res.json({
            success: true,
            algorithm: "Adjacency List & BFS Graph Traversal",
            nodesTraversed: graphData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 4. Hash Table: O(1) Book Lookup Simulation
router.post("/hash-table", async (req, res) => {
    try {
        const [books] = await pool.execute("SELECT id, title, author, subject FROM books");

        const ht = new HashTable(101);
        books.forEach((b) => {
            ht.set(b.id, b);
        });

        const lookupId = Number(req.body.id || (books[0] ? books[0].id : 1));
        const found = ht.get(lookupId);

        res.json({
            success: true,
            algorithm: "Separate Chaining Hash Table",
            lookupId,
            found
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 5. Search & Sort: MergeSort by Match Score
router.post("/search-sort", async (req, res) => {
    try {
        const items = req.body.books || [
            { id: 1, title: "Algorithms in C", matchScore: 45 },
            { id: 2, title: "Operating Systems", matchScore: 92 },
            { id: 3, title: "Database Systems", matchScore: 78 }
        ];

        const sorted = mergeSortByMatchScore(items);

        res.json({
            success: true,
            algorithm: "MergeSort & BinarySearch",
            sorted
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
