import { useState } from "react";
import {
    sendGuestOTP,
    verifyGuestOTP,
    donateGuestBook,
    donateBook,
    analyzeBookImage

    
} from "../api";

function DonateBook() {
        const currentUser =
        JSON.parse(
            localStorage.getItem("mineptheCurrentUser") ||
            localStorage.getItem("currentUser") ||
            localStorage.getItem("mineptheUser") ||
            "null"
        );
     

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [demoOtp, setDemoOtp] = useState("");
    const [verificationToken, setVerificationToken] =
        useState("");

    const [phoneVerified, setPhoneVerified] =
        useState(false);
const [bookImage, setBookImage] = useState(() => {
    try {
        const savedBook = JSON.parse(
            localStorage.getItem("verifiedBook")
        );

        return savedBook?.image || "";
    } catch (error) {
        return "";
    }
});
const [aiLoading, setAiLoading] = useState(false);
const [aiMessage, setAiMessage] = useState("");
const handleBookImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        setAiMessage("Please select a valid book image.");
        return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
        const imageData = reader.result;

        setBookImage(imageData);
        setAiMessage("Analyzing book...");
        setAiLoading(true);

        try {
            const response = await analyzeBookImage({
                image: imageData
            });

            const detectedBook =
                response?.analysis?.book;

            if (detectedBook) {
                setBook((previous) => ({
                    ...previous,
                    title:
                        detectedBook.title ||
                        previous.title,
                    author:
                        detectedBook.author ||
                        previous.author,
                    subject:
                        detectedBook.subject ||
                        previous.subject,
                    language:
                        detectedBook.language ||
                        previous.language,
                    isbn:
                        detectedBook.isbn ||
                        previous.isbn
                }));

                setAiMessage(
                    "Book image analyzed. Please review and correct the detected details if needed."
                );
            } else {
                setAiMessage(
                    "AI could not detect reliable book details. Please enter them manually."
                );
            }
        } catch (error) {
            setAiMessage(
                error.message ||
                "Unable to analyze the book image."
            );
        } finally {
            setAiLoading(false);
        }
    };

    reader.readAsDataURL(file);
};
    const [book, setBook] = useState(() => {
    try {
        const savedBook =
            JSON.parse(
                localStorage.getItem("verifiedBook")
            );

        if (savedBook) {
            return {
                title: savedBook.title || "",
                author: savedBook.author || "",
                subject: savedBook.subject || "",
                department: savedBook.department || "",
                year: savedBook.year || "",
                language: savedBook.language || "",
                isbn: savedBook.isbn || "",
                condition: savedBook.condition || "Good",
                location: savedBook.location || "",
                description: savedBook.description || ""
            };
        }
    } catch (error) {
        console.error(
            "Could not load verified book:",
            error
        );
    }

    return {
        title: "",
        author: "",
        subject: "",
        department: "",
        year: "",
        language: "",
        isbn: "",
        condition: "Good",
        location: "",
        description: ""
    };
});

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setBook((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    const handleSendOTP = async () => {

        if (!/^\d{10}$/.test(phone.trim())) {

            setMessage(
                "Please enter a valid 10-digit phone number."
            );

            return;
        }

        try {

            setLoading(true);
            setMessage("");
            setDemoOtp("");

            const data =
                await sendGuestOTP(
                    phone.trim()
                );

            setDemoOtp(
                data.demoOtp || ""
            );

            setMessage(
                "Demo OTP generated successfully. Use the OTP shown below."
            );

        } catch (error) {

            setMessage(
                error.message ||
                "Could not generate OTP."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleVerifyOTP = async () => {

        if (!otp.trim()) {

            setMessage(
                "Please enter the OTP."
            );

            return;
        }

        try {

            setLoading(true);
            setMessage("");

            const data =
                await verifyGuestOTP(
                    phone.trim(),
                    otp.trim()
                );

            setPhoneVerified(true);

            setVerificationToken(
                data.verificationToken
            );

            setMessage(
                "Phone verified successfully. Your mobile number will not be stored."
            );

        } catch (error) {

            setMessage(
                error.message ||
                "Invalid OTP."
            );

        } finally {

            setLoading(false);
        }
    };


    const submitDonation = async (event) => {

        event.preventDefault();

        if (!phoneVerified) {

            setMessage(
                "Please verify your phone number first."
            );

            return;
        }

        if (!verificationToken) {
            setMessage(
                "Guest verification is missing. Please verify again."
            );

            return;
        }

        // Logged-in donor donation
        if (currentUser?.id) {
            try {
                setLoading(true);
                setMessage("");

                const response = await donateBook({
                    donorId: Number(currentUser.id),
                    title: book.title.trim(),
                    author: book.author.trim(),
                    subject: book.subject.trim(),
                    department: book.department.trim(),
                    year: book.year.trim(),
                    description: [
                        book.language
                            ? `Language: ${book.language}`
                            : "",
                        book.isbn
                            ? `ISBN: ${book.isbn}`
                            : "",
                        book.condition
                            ? `Condition: ${book.condition}`
                            : "",
                        book.location
                            ? `Collection: ${book.location}`
                            : "",
                        book.description.trim()
                    ]
                        .filter(Boolean)
                        .join("\n"),
                    coverImage: bookImage ||null
                });

                setMessage(
                    response?.message ||
                    `Book donation submitted successfully. Book ID: ${response?.bookId || ""}`
                );

                setBook({
                    title: "",
                    author: "",
                    subject: "",
                    department: "",
                    year: "",
                    language: "",
                    isbn: "",
                    condition: "",
                    location: "",
                    description: ""
                });

                return;
            } catch (error) {
                setMessage(
                    error.message ||
                    "Unable to submit book donation."
                );
                return;
            } finally {
                setLoading(false);
            }

        }

        if (!book.title.trim()) {

            setMessage(
                "Please enter the book title."
            );

            return;
        }

        if (!book.location.trim()) {

            setMessage(
                "Please enter a collection location."
            );

            return;
        }

        try {

            setLoading(true);
            setMessage("");

            const description =
                "Language: " +
                (book.language ||
                    "Not specified") +
                " | ISBN: " +
                (book.isbn ||
                    "Not available") +
                " | Condition: " +
                book.condition +
                " | Collection: " +
                book.location +
                " | " +
                (book.description || "");

            const data =
                await donateGuestBook({

                    verificationToken,

                    title:
                        book.title.trim(),

                    author:
                        book.author.trim(),

                    subject:
                        book.subject.trim(),

                    department:
                        book.department.trim(),

                    year:
                        book.year.trim(),

                    description,

                    cover_image: bookImage || null
                });

            setMessage(
                "Book donated successfully. Book ID: " +
                data.bookId
            );

            setVerificationToken("");
            setPhoneVerified(false);
            setDemoOtp("");
            setOtp("");
            setPhone("");

            setBook({
                title: "",
                author: "",
                subject: "",
                department: "",
                year: "",
                language: "",
                isbn: "",
                condition: "Good",
                location: "",
                description: ""
            });

        } catch (error) {

            setMessage(
                error.message ||
                "Book donation failed."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="page-container">

            <div className="form-container">

                <h1>Donate a Book</h1>

                <p>
                    Share an academic book with a
                    student who needs it.
                </p>


                <div className="form-section">

                    <h2>
                        1. Verify Guest Donor
                    </h2>

                    <label>
                        Mobile Number
                        <input
                            type="tel"
                            value={phone}
                            onChange={(event) =>
                                setPhone(
                                    event.target.value
                                )
                            }
                            placeholder="Enter 10-digit mobile number"
                            maxLength="10"
                            disabled={phoneVerified}
                        />
                    </label>


                    <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={
                            loading ||
                            phoneVerified
                        }
                    >
                        {loading
                            ? "Processing..."
                            : "Generate OTP"}
                    </button>


                    {demoOtp && !phoneVerified && (
                        <div
                            className="form-message"
                            style={{
                                marginTop: "12px",
                                fontWeight: "bold"
                            }}
                        >
                            Demo OTP:{" "}
                            <strong>
                                {demoOtp}
                            </strong>
                        </div>
                    )}


                    {demoOtp && !phoneVerified && (
                        <>
                            <label>
                                Enter OTP
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(event) =>
                                        setOtp(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter 6-digit OTP"
                                    maxLength="6"
                                />
                            </label>

                            <button
                                type="button"
                                onClick={
                                    handleVerifyOTP
                                }
                                disabled={loading}
                            >
                                Verify OTP
                            </button>
                        </>
                    )}


                    {phoneVerified && (
                        <div className="form-message">
                            ✓ Phone verified.
                            <br />
                            Your mobile number is used
                            only for temporary OTP
                            verification and is not
                            stored in the database.
                        </div>
                    )}

                </div>


                <form
                    onSubmit={submitDonation}
                >

                    <div className="form-section">

                        <h2>
                            2. Book Details
                        </h2>

<div className="form-group">
    <label>
        Book Cover / Page Image
    </label>

    <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleBookImage}
    />

    <small>
        Upload one clear book cover or page image.
        AI will identify visible book details.
    </small>

    {bookImage && (
        <div style={{ marginTop: "12px" }}>
            <img
                src={bookImage}
                alt="Selected book"
                style={{
                    width: "180px",
                    maxHeight: "240px",
                    objectFit: "cover",
                    borderRadius: "10px"
                }}
            />
        </div>
    )}

    {aiLoading && (
        <p>
            AI is analyzing the book image...
        </p>
    )}

    {aiMessage && (
        <p>
            {aiMessage}
        </p>
    )}
</div>
                        <label>
                            Book Title
                            <input
                                type="text"
                                name="title"
                                value={
                                    book.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter book title"
                                required
                            />
                        </label>


                        <label>
                            Author
                            <input
                                type="text"
                                name="author"
                                value={
                                    book.author
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter author name"
                            />
                        </label>


                        <label>
                            Subject
                            <input
                                type="text"
                                name="subject"
                                value={
                                    book.subject
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: Data Structures"
                            />
                        </label>


                        <label>
                            Department
                            <input
                                type="text"
                                name="department"
                                value={
                                    book.department
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: Computer Engineering"
                            />
                        </label>


                        <label>
                            Academic Year
                            <input
                                type="text"
                                name="year"
                                value={
                                    book.year
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: Second Year"
                            />
                        </label>


                        <label>
                            ISBN
                            <input
                                type="text"
                                name="isbn"
                                value={
                                    book.isbn
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter ISBN if available"
                            />
                        </label>


                        <label>
                            Language
                            <select
                                name="language"
                                value={
                                    book.language
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="">
                                    Select language
                                </option>

                                <option value="English">
                                    English
                                </option>

                                <option value="Marathi">
                                    Marathi
                                </option>

                                <option value="Hindi">
                                    Hindi
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </label>


                        <label>
                            Book Condition
                            <select
                                name="condition"
                                value={
                                    book.condition
                                }
                                onChange={
                                    handleChange
                                }
                            >
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
                        </label>


                        <label>
                            Collection Location
                            <input
                                type="text"
                                name="location"
                                value={
                                    book.location
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter safe collection location"
                                required
                            />
                        </label>


                        <label>
                            Description
                            <textarea
                                name="description"
                                value={
                                    book.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Add any additional information"
                                rows="5"
                            />
                        </label>


                        {message && (
                            <div className="form-message">
                                {message}
                            </div>
                        )}


                 <button
    type="submit"
    disabled={loading}
>
    {loading
        ? "Submitting..."
        : currentUser?.id
            ? "Submit Donation"
            : "Submit Guest Donation"}
</button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default DonateBook;