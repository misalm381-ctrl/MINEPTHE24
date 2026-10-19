/**
 * Custom Hash Table with Separate Chaining for O(1) Book Lookups
 * Academic DSA Module (Node.js & C equivalent)
 */

class HashTable {
    constructor(size = 53) {
        this.size = size;
        this.table = new Array(size);
    }

    _hash(key) {
        let total = 0;
        const prime = 31;
        const strKey = String(key);
        for (let i = 0; i < Math.min(strKey.length, 100); i++) {
            const charCode = strKey.charCodeAt(i);
            total = (total * prime + charCode) % this.size;
        }
        return total;
    }

    set(key, value) {
        const index = this._hash(key);
        if (!this.table[index]) {
            this.table[index] = [];
        }

        // Check if key already exists, update value
        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i][0] === key) {
                this.table[index][i][1] = value;
                return;
            }
        }

        this.table[index].push([key, value]);
    }

    get(key) {
        const index = this._hash(key);
        if (!this.table[index]) return null;

        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i][0] === key) {
                return this.table[index][i][1];
            }
        }
        return null;
    }

    has(key) {
        return this.get(key) !== null;
    }
}

module.exports = { HashTable };
