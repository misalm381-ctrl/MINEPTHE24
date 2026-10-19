import { Link } from "react-router-dom";

function SellBook() {
    const handleSubmit = (event) => {
        event.preventDefault();

        alert(
            "Your book has been listed for sale in this presentation demo."
        );
    };

    return (
        <div className="form-page">

            <form
                className="form-box"
                onSubmit={handleSubmit}
            >

                <div className="section-tag">
                    SELL A BOOK
                </div>

                <h1>
                    Sell your academic book.
                </h1>

                <p>
                    Have a book you no longer need?
                    List it on MINEPTHE and let another
                    student find it.
                </p>

                <label>
                    Book Title *
                </label>

                <input
                    type="text"
                    placeholder="Enter book title"
                    required
                />

                <label>
                    Author *
                </label>

                <input
                    type="text"
                    placeholder="Enter author name"
                    required
                />

                <label>
                    Category / Subject *
                </label>

                <input
                    type="text"
                    placeholder="Example: Data Structures"
                    required
                />

                <label>
                    Book Condition *
                </label>

                <select
                    required
                    style={{
                        width: "100%",
                        padding: "15px",
                        marginBottom: "13px",
                        border: "1px solid #d5d5d0",
                        borderRadius: "8px",
                        background: "white"
                    }}
                >
                    <option value="">
                        Select condition
                    </option>

                    <option value="New">
                        New
                    </option>

                    <option value="Like New">
                        Like New
                    </option>

                    <option value="Good">
                        Good
                    </option>

                    <option value="Acceptable">
                        Acceptable
                    </option>
                </select>

                <label>
                    Selling Price (₹) *
                </label>

                <input
                    type="number"
                    min="1"
                    placeholder="Example: 350"
                    required
                />

                <label>
                    Book Description *
                </label>

                <textarea
                    placeholder="Describe the book, edition, notes, highlighting, etc."
                    rows="5"
                    required
                />

                <label>
                    Book Image *
                </label>

                <input
                    type="file"
                    accept="image/*"
                    required
                />

                <label>
                    Collection Location *
                </label>

                <input
                    type="text"
                    placeholder="Example: Public collection point, Pune"
                    required
                />

                <div className="demo-note">
                    🔒 Your personal contact information will
                    remain private.
                    <br />
                    MINEPTHE does not publicly display your
                    phone number or email.
                </div>

                <button type="submit">
                    List Book for Sale →
                </button>

                <Link to="/dashboard">
                    ← Back to Dashboard
                </Link>

            </form>

        </div>
    );
}

export default SellBook;
