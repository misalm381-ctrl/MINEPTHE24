/**
 * Priority Queue (Binary Max-Heap) for Student Book Requests
 * Academic DSA Module (Node.js & C equivalent)
 */

class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    getLeftChildIndex(i) {
        return 2 * i + 1;
    }

    getRightChildIndex(i) {
        return 2 * i + 2;
    }

    swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    enqueue(item, priority) {
        const node = { item, priority };
        this.heap.push(node);
        this.heapifyUp(this.heap.length - 1);
    }

    heapifyUp(index) {
        let current = index;
        while (
            current > 0 &&
            this.heap[current].priority >
                this.heap[this.getParentIndex(current)].priority
        ) {
            const parent = this.getParentIndex(current);
            this.swap(current, parent);
            current = parent;
        }
    }

    dequeue() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop().item;

        const maxItem = this.heap[0].item;
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return maxItem;
    }

    heapifyDown(index) {
        let current = index;
        const length = this.heap.length;

        while (this.getLeftChildIndex(current) < length) {
            let largerChild = this.getLeftChildIndex(current);
            const rightChild = this.getRightChildIndex(current);

            if (
                rightChild < length &&
                this.heap[rightChild].priority > this.heap[largerChild].priority
            ) {
                largerChild = rightChild;
            }

            if (this.heap[current].priority >= this.heap[largerChild].priority) {
                break;
            }

            this.swap(current, largerChild);
            current = largerChild;
        }
    }

    size() {
        return this.heap.length;
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0].item : null;
    }
}

module.exports = { PriorityQueue };
