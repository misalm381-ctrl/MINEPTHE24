function analyzeSyllabus(syllabusText) {
    if (!syllabusText || !syllabusText.trim()) {
        throw new Error("Syllabus text is required.");
    }

    const text = syllabusText.toLowerCase();

    const subjects = [];
    const keywords = [];

    // Detect common academic subjects/topics
    const subjectRules = [
        {
            names: [
                "data structures",
                "data structure",
                "dsa"
            ],
            subject: "Data Structures",
            topics: [
                "Arrays",
                "Linked Lists",
                "Stacks",
                "Queues",
                "Trees",
                "Graphs"
            ],
            keywords: [
                "arrays",
                "linked lists",
                "stacks",
                "queues",
                "trees",
                "graphs"
            ]
        },

        {
            names: [
                "database",
                "dbms",
                "database management"
            ],
            subject: "Database Management Systems",
            topics: [
                "SQL",
                "Relational Database",
                "Normalization",
                "Transactions"
            ],
            keywords: [
                "sql",
                "database",
                "normalization",
                "transactions"
            ]
        },

        {
            names: [
                "operating system",
                "operating systems",
                "os"
            ],
            subject: "Operating Systems",
            topics: [
                "Processes",
                "Threads",
                "Memory Management",
                "File Systems"
            ],
            keywords: [
                "process",
                "threads",
                "memory",
                "file systems"
            ]
        },

        {
            names: [
                "computer network",
                "computer networks",
                "networking"
            ],
            subject: "Computer Networks",
            topics: [
                "Network Models",
                "TCP/IP",
                "Routing",
                "Network Security"
            ],
            keywords: [
                "network",
                "tcp",
                "ip",
                "routing"
            ]
        },

        {
            names: [
                "programming in c",
                "c programming",
                "c language"
            ],
            subject: "C Programming",
            topics: [
                "Variables",
                "Functions",
                "Pointers",
                "Structures",
                "File Handling"
            ],
            keywords: [
                "c",
                "functions",
                "pointers",
                "structures"
            ]
        },

        {
            names: [
                "python",
                "python programming"
            ],
            subject: "Python Programming",
            topics: [
                "Variables",
                "Functions",
                "Lists",
                "Dictionaries",
                "Object Oriented Programming"
            ],
            keywords: [
                "python",
                "functions",
                "lists",
                "dictionaries"
            ]
        },

        {
            names: [
                "java",
                "java programming"
            ],
            subject: "Java Programming",
            topics: [
                "Classes",
                "Objects",
                "Inheritance",
                "Interfaces",
                "Exception Handling"
            ],
            keywords: [
                "java",
                "classes",
                "objects",
                "inheritance"
            ]
        },

        {
            names: [
                "software engineering",
                "software engineering"
            ],
            subject: "Software Engineering",
            topics: [
                "Software Development Life Cycle",
                "Requirements",
                "Testing",
                "Software Design"
            ],
            keywords: [
                "software",
                "requirements",
                "testing",
                "design"
            ]
        }
    ];

    subjectRules.forEach((rule) => {
        const found = rule.names.some((name) =>
            text.includes(name)
        );

        if (found) {
            subjects.push({
                name: rule.subject,
                topics: rule.topics
            });

            rule.keywords.forEach((keyword) => {
                if (!keywords.includes(keyword)) {
                    keywords.push(keyword);
                }
            });
        }
    });

    // Detect common topic keywords even if subject name is not present
    const topicKeywords = [
        "arrays",
        "linked lists",
        "stacks",
        "queues",
        "trees",
        "graphs",
        "sorting",
        "searching",
        "algorithms",
        "sql",
        "normalization",
        "transactions",
        "processes",
        "threads",
        "memory management",
        "routing",
        "tcp/ip",
        "network security"
    ];

    topicKeywords.forEach((keyword) => {
        if (
            text.includes(keyword) &&
            !keywords.includes(keyword)
        ) {
            keywords.push(keyword);
        }
    });

    // Try to identify course information
    let course = null;

    const coursePatterns = [
        /course\s*:\s*([^\n]+)/i,
        /course\s*name\s*:\s*([^\n]+)/i,
        /program\s*:\s*([^\n]+)/i
    ];

    for (const pattern of coursePatterns) {
        const match = syllabusText.match(pattern);

        if (match) {
            course = match[1].trim();
            break;
        }
    }

    // Try to identify department
    let department = null;

    const departmentPatterns = [
        /department\s*:\s*([^\n]+)/i,
        /branch\s*:\s*([^\n]+)/i
    ];

    for (const pattern of departmentPatterns) {
        const match = syllabusText.match(pattern);

        if (match) {
            department = match[1].trim();
            break;
        }
    }

    // Try to identify year
    let year = null;

    const yearPatterns = [
        /year\s*:\s*([^\n]+)/i,
        /([1-4](?:st|nd|rd|th)?\s*year)/i
    ];

    for (const pattern of yearPatterns) {
        const match = syllabusText.match(pattern);

        if (match) {
            year = match[1].trim();
            break;
        }
    }

    return {
        success: true,

        syllabus: {
            course,
            department,
            year,
            subjects,
            keywords
        },

        message: "Syllabus analyzed successfully."
    };
}

module.exports = {
    analyzeSyllabus
};

