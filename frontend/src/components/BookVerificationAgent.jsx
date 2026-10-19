import { useState } from "react";

function BookVerificationAgent() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setStatus("ready");
    setResult(null);
  };

  const verifyBook = () => {
    if (!image) return;

    setStatus("analyzing");
    setResult(null);

    setTimeout(() => {
      setStatus("verified");

      setResult({
        title: "Book title detected",
        author: "Author detected",
        subject: "Academic subject detected",
        isbn: "ISBN checked",
        edition: "Edition / publisher checked",
        imageQuality: "Good",
        academicRelevance: "Relevant",
        confidence: 96,
      });
    }, 1500);
  };

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "35px auto",
        padding: "30px",
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ marginBottom: "25px" }}>
        <span
          style={{
            display: "inline-block",
            padding: "7px 14px",
            borderRadius: "20px",
            background: "#eef6ff",
            color: "#1769aa",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          🤖 MINEPTHE AI AGENT
        </span>

        <h2
          style={{
            margin: "14px 0 6px",
            color: "#172033",
            fontSize: "28px",
          }}
        >
          Book Cover Verification
        </h2>

        <p style={{ color: "#687386", lineHeight: "1.6" }}>
          Upload a photo of the book cover and MINEPTHE AI will analyze
          the visible book information.
        </p>
      </div>

      <label
        style={{
          display: "block",
          padding: "35px 20px",
          border: "2px dashed #b8c4d6",
          borderRadius: "16px",
          textAlign: "center",
          cursor: "pointer",
          background: "#f9fbfd",
        }}
      >
        <div style={{ fontSize: "45px" }}>📚</div>

        <strong style={{ color: "#172033", fontSize: "17px" }}>
          Upload Book Cover
        </strong>

        <p style={{ color: "#687386" }}>
          JPG, JPEG or PNG
        </p>

        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </label>

      {preview && (
        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <p>
            <strong>Uploaded Book Cover</strong>
          </p>

          <img
            src={preview}
            alt="Uploaded book cover"
            style={{
              maxWidth: "240px",
              maxHeight: "320px",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      )}

      {image &&
        status !== "analyzing" &&
        status !== "verified" && (
          <button
            onClick={verifyBook}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: "#172033",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            🤖 Verify Book with AI
          </button>
        )}

      {status === "analyzing" && (
        <div
          style={{
            marginTop: "25px",
            padding: "22px",
            borderRadius: "15px",
            background: "#f5f8fc",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "35px" }}>🤖</div>

          <h3>MINEPTHE AI is analyzing...</h3>

          <p style={{ color: "#687386" }}>
            Detecting book information from the cover...
          </p>

          <div
            style={{
              marginTop: "18px",
              height: "8px",
              borderRadius: "10px",
              background: "#dce3ec",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#1769aa",
              }}
            />
          </div>
        </div>
      )}

      {status === "verified" && result && (
        <div
          style={{
            marginTop: "25px",
            padding: "24px",
            borderRadius: "16px",
            background: "#f0faf4",
            border: "1px solid #b9e4c8",
          }}
        >
          <h3
            style={{
              margin: "0 0 18px",
              color: "#16803c",
            }}
          >
            ✓ BOOK COVER VERIFIED
          </h3>

          <div
            style={{
              lineHeight: "2",
              color: "#263238",
            }}
          >
            <div>
              <strong>Book:</strong> {result.title}
            </div>

            <div>
              <strong>Author:</strong> {result.author}
            </div>

            <div>
              <strong>Category:</strong> {result.subject}
            </div>

            <div>
              <strong>ISBN:</strong> {result.isbn}
            </div>

            <div>
              <strong>Edition:</strong> {result.edition}
            </div>

            <div>
              <strong>Image Quality:</strong> {result.imageQuality}
            </div>

            <div>
              <strong>Academic Relevance:</strong>{" "}
              {result.academicRelevance}
            </div>

            <div>
              <strong>AI Confidence:</strong>{" "}
              {result.confidence}%
            </div>
          </div>

          <p
            style={{
              marginTop: "15px",
              color: "#16803c",
              fontWeight: "600",
            }}
          >
            ✓ Book verification completed successfully.
          </p>
        </div>
      )}

      <p
        style={{
          marginTop: "22px",
          fontSize: "12px",
          color: "#8792a2",
          lineHeight: "1.6",
        }}
      >
        Presentation prototype: MINEPTHE AI simulates fast book-cover
        verification. A production version can connect this agent to a
        real vision AI service.
      </p>
    </div>
  );
}

export default BookVerificationAgent;