# Data Structures & Algorithms (DSA) Implementation

MINEPTHE implements five foundational Data Structures & Algorithms. Each algorithm is implemented in two forms:
1. **Academic C Source Code** (`backend/dsa/*.c`) for university lab evaluations and compiler submissions.
2. **Production JavaScript Engine** (`backend/dsa/*.js`) for active execution inside the Express backend.

---

## 1. Dijkstra's Shortest Path Algorithm
- **Files**: `backend/dsa/dijkstra.c`, `backend/dsa/dijkstra.js`
- **Application in MINEPTHE**: Calculates the shortest geographic path from a student's current campus coordinates to the nearest approved, safe collection desk.
- **Time Complexity**: $O(V^2)$ (unoptimized matrix) / $O((V + E) \log V)$ (with min-heap)
- **Space Complexity**: $O(V)$
- **Live Endpoint**: `POST /api/dsa/dijkstra`
  ```json
  { "latitude": 18.5204, "longitude": 73.8567 }
  ```

---

## 2. Priority Queue (Binary Max-Heap)
- **Files**: `backend/dsa/priority_queue.c`, `backend/dsa/priority_queue.js`
- **Application in MINEPTHE**: When multiple students request a single copy of a scarce textbook, the priority queue ranks requests using a multi-factor priority score:
  $$\text{Priority} = (\text{Semester Urgency} \times 10) + \text{Donor Reputation Points}$$
- **Time Complexity**:
  - Insert / Enqueue: $O(\log N)$
  - Extract Max / Dequeue: $O(\log N)$
  - Peek: $O(1)$
- **Space Complexity**: $O(N)$
- **Live Endpoint**: `POST /api/dsa/priority-queue`

---

## 3. Graph Data Structure (Adjacency List & BFS)
- **Files**: `backend/dsa/graph.c`, `backend/dsa/graph.js`
- **Application in MINEPTHE**: Maps the relationships between Engineering Departments, Subjects, and Books. Breadth-First Search (BFS) traverses interdisciplinary electives (e.g., Computer Engineering sharing textbooks with IT and AI/DS).
- **Time Complexity**:
  - Graph Construction: $O(V + E)$
  - BFS Traversal: $O(V + E)$
- **Space Complexity**: $O(V + E)$
- **Live Endpoint**: `GET /api/dsa/graph`

---

## 4. Hash Table with Separate Chaining
- **Files**: `backend/dsa/hash_table.c`, `backend/dsa/hash_table.js`
- **Application in MINEPTHE**: Provides instantaneous $O(1)$ lookup for book inventory using standard ISBN or internal book ID keys, preventing linear scans over large catalogs.
- **Time Complexity**:
  - Insert: $O(1)$ average, $O(N)$ worst case
  - Search / Lookup: $O(1)$ average, $O(N)$ worst case
- **Space Complexity**: $O(M + N)$ where $M$ is bucket size and $N$ is total records.
- **Live Endpoint**: `POST /api/dsa/hash-table`
  ```json
  { "id": 1 }
  ```

---

## 5. MergeSort & Binary Search
- **Files**: `backend/dsa/search_sort.c`, `backend/dsa/search_sort.js`
- **Application in MINEPTHE**:
  - **MergeSort**: Ranks matched books in descending order by AI syllabus similarity score in $O(N \log N)$ stable time.
  - **Binary Search**: Searches sorted ID arrays in $O(\log N)$ time.
- **Time Complexity**:
  - MergeSort: $O(N \log N)$ (Best, Average, and Worst case)
  - Binary Search: $O(\log N)$
- **Space Complexity**: $O(N)$ auxiliary space for MergeSort.
- **Live Endpoint**: `POST /api/dsa/search-sort`
