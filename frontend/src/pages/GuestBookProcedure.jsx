import { useState } from "react";
import "./GuestBookProcedure.css";

function GuestBookProcedure() {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        subject: "",
        department: "",
        year: "",
        condition: "",
        language: "",
        location: "",
        description: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        setMessage("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            !formData.title.trim() ||
            !formData.subject.trim() ||
            !formData.condition ||
            !formData.language ||
            !formData.location.trim()
        ) {
            setMessage("Please fill all required fields.");
            return;
        }

        setMessage(
            "Book details saved successfully. Next step is book verification."
        );
    };

    return (
        <div className="procedure-page">
            {/* HEADER */}

            <header className="procedure-header">
                <a href="/" className="procedure-logo">
                    MINEPTHE
                </a>

                <div>
                    <span className="procedure-label">
                        GUEST DONOR
                    </span>

                    <h1>Book Donation Procedure</h1>

                    <p>
                        Give your academic book to another student and keep
                        knowledge moving.
                    </p>
                </div>
            </header>

            {/* PROGRESS */}

            <div className="procedure-progress">
                <div className="procedure-step completed">
                    <span>✓</span>
                    <strong>Phone</strong>
                </div>

                <div className="procedure-line"></div>

                <div className="procedure-step active">
                    <span>2</span>
                    <strong>Book Details</strong>
                </div>

                <div className="procedure-line"></div>

                <div className="procedure-step">
                    <span>3</span>
                    <strong>Verification</strong>
                </div>

                <div className="procedure-line"></div>

                <div className="procedure-step">
                    <span>4</span>
                    <strong>Collection</strong>
                </div>
            </div>

            {/* MAIN */}

            <main className="procedure-container">
                <div className="procedure-card">
                    <div className="procedure-card-header">
                        <span className="procedure-icon">📚</span>

                        <div>
                            <h2>Enter Book Details</h2>

                            <p>
                                Tell us about the academic book you want to
                                donate.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* TITLE */}

                        <div className="form-group">
                            <label>
                                Book Title <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="title"
                                placeholder="Enter book title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* AUTHOR */}

                        <div className="form-group">
                            <label>Author</label>

                            <input
                                type="text"
                                name="author"
                                placeholder="Enter author name"
                                value={formData.author}
                                onChange={handleChange}
                            />
                        </div>

                        {/* ISBN */}

                        <div className="form-group">
                            <label>ISBN</label>

                            <input
                                type="text"
                                name="isbn"
                                placeholder="Enter ISBN if available"
                                value={formData.isbn}
                                onChange={handleChange}
                            />
                        </div>

                        {/* SUBJECT */}

                        <div className="form-group">
                            <label>
                                Subject / Category <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="subject"
                                placeholder="Example: Data Structures"
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>

                        {/* DEPARTMENT */}

                        <div className="form-group">
                            <label>Department</label>

                            <input
                                type="text"
                                name="department"
                                placeholder="Example: Computer Engineering"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </div>

                        {/* YEAR */}

                        <div className="form-group">
                            <label>Academic Year</label>

                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select academic year
                                </option>
                                <option value="1">First Year</option>
                                <option value="2">Second Year</option>
                                <option value="3">Third Year</option>
                                <option value="4">Fourth Year</option>
                            </select>
                        </div>

                        {/* CONDITION */}

                        <div className="form-group">
                            <label>
                                Book Condition <span>*</span>
                            </label>

                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select condition
                                </option>
                                <option value="New">New</option>
                                <option value="Like New">
                                    Like New
                                </option>
                                <option value="Good">Good</option>
                                <option value="Acceptable">
                                    Acceptable
                                </option>
                            </select>
                        </div>

                        {/* LANGUAGE */}

                        <div className="form-group">
                            <label>
                                Language <span>*</span>
                            </label>

                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select language
                                </option>
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Marathi">Marathi</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* LOCATION */}

                        <div className="form-group">
                            <label>
                                Collection Location <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="location"
                                placeholder="Enter preferred collection location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        {/* DESCRIPTION */}

                        <div className="form-group">
                            <label>Description</label>

                            <textarea
                                name="description"
                                placeholder="Add any useful information about the book"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                            ></textarea>
                        </div>

                        {/* MESSAGE */}

                        {message && (
                            <div className="procedure-message">
                                {message}
                            </div>
                        )}

                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="procedure-submit"
                        >
                            Save Book Details
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default GuestBookProcedure;