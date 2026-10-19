/**
 * Search and Sort Algorithms for Books and Match Ranking
 * Academic DSA Module (Node.js & C equivalent)
 */

function binarySearchById(books, targetId) {
    let left = 0;
    let right = books.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (books[mid].id === targetId) {
            return books[mid];
        }
        if (books[mid].id < targetId) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return null;
}

function mergeSortByMatchScore(books) {
    if (books.length <= 1) return books;

    const mid = Math.floor(books.length / 2);
    const left = mergeSortByMatchScore(books.slice(0, mid));
    const right = mergeSortByMatchScore(books.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        const scoreA = left[i].matchScore !== undefined ? left[i].matchScore : 0;
        const scoreB = right[j].matchScore !== undefined ? right[j].matchScore : 0;

        // Descending order: highest score first
        if (scoreA >= scoreB) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

module.exports = {
    binarySearchById,
    mergeSortByMatchScore
};
