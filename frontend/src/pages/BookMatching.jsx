import { useState } from "react";

function BookMatching() {
    const [title, setTitle] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        const books = JSON.parse(
            localStorage.getItem("mineptheBooks") || "[]"
        );

        if (!title.trim()) {
            setResults(books);
            return;
        }

        const searchText = title.toLowerCase();

        const matchedBooks = books.filter((book) => {
            const bookTitle = String(
                book.title || ""
            ).toLowerCase();

            const author = String(
                book.author || ""
            ).toLowerCase();

            const subject = String(
                book.subject || ""
            ).toLowerCase();

            return (
                bookTitle.includes(searchText) ||
                author.includes(searchText) ||
                subject.includes(searchText)
            );
        });

        setResults(matchedBooks);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "30px 20px",
                background: "#f5f7fb"
            }}
        >
            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto"
                }}
            >
                <h1>Smart Book Matching</h1>

                <p>
                    Find books that match your academic needs.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "20px",
                        marginBottom: "25px"
                    }}
                >
                    <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        placeholder="Search by title, author or subject"
                        style={{
                            flex: 1,
                            padding: "12px",
                            border: "1px solid #ccc",
                            borderRadius: "8px"
                        }}
                    />

                    <button
                        onClick={handleSearch}
                        style={{
                            padding: "12px 20px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#222",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        Find Books
                    </button>
                </div>

                {results.length === 0 ? (
                    <div
                        style={{
                            background: "#fff",
                            padding: "25px",
                            borderRadius: "12px"
                        }}
                    >
                        No matching books found.
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gap: "15px"
                        }}
                    >
                        {results.map((book, index) => (
                            <div
                                key={
                                    book.id ||
                                    "matching-book-" + index
                                }
                                style={{
                                    background: "#fff",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,0.06)"
                                }}
                            >
                                <h3>
                                    {book.title ||
                                        "Untitled Book"}
                                </h3>

                                <p>
                                    Author:{" "}
                                    {book.author ||
                                        "Not available"}
                                </p>

                                <p>
                                    Subject:{" "}
                                    {book.subject ||
                                        "Not available"}
                                </p>

                                <p>
                                    Language:{" "}
                                    {book.language ||
                                        "Not available"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookMatching;
