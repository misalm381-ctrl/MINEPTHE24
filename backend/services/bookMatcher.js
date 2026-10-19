function normalizeText(value) {
    if (!value) {
        return "";
    }

    return String(value)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getWords(value) {
    return normalizeText(value)
        .split(" ")
        .filter((word) => word.length > 2);
}

function calculateMatchScore(
    book,
    studentSubjects = []
) {
    const bookText = normalizeText(
        [
            book.title,
            book.author,
            book.subject,
            book.category,
            book.description,
            book.language
        ]
            .filter(Boolean)
            .join(" ")
    );

    const subjectText = normalizeText(
        Array.isArray(studentSubjects)
            ? studentSubjects.join(" ")
            : studentSubjects
    );

    if (!bookText || !subjectText) {
        return 0;
    }

    const studentWords =
        getWords(subjectText);

    if (studentWords.length === 0) {
        return 0;
    }

    let matchedWords = 0;

    studentWords.forEach((word) => {
        if (bookText.includes(word)) {
            matchedWords++;
        }
    });

    return Math.round(
        (matchedWords /
            studentWords.length) *
            100
    );
}

function matchBooks(
    books = [],
    studentSubjects = []
) {
    return books
        .filter(
            (book) =>
                book.available !== false &&
                book.status !== "transferred"
        )
        .map((book) => {
            const score =
                calculateMatchScore(
                    book,
                    studentSubjects
                );

            return {
                ...book,
                matchScore: score
            };
        })
        .filter(
            (book) =>
                book.matchScore > 0
        )
        .sort(
            (a, b) =>
                b.matchScore -
                a.matchScore
        );
}

module.exports = {
    calculateMatchScore,
    matchBooks
};