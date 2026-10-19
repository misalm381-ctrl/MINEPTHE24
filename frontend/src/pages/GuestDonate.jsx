import { useState } from "react";
import { Link } from "react-router-dom";
import "./GuestDonate.css";

function GuestDonate() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const sendOTP = async (event) => {
    event.preventDefault();

    if (!/^\d{10}$/.test(phone)) {
      setMessage("Please enter a valid 10-digit phone number.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/guest/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to send OTP.");
        setMessageType("error");
        return;
      }

      setOtpSent(true);
      setMessage(
        "Demo OTP generated. Check the backend terminal for the OTP."
      );
      setMessageType("success");
    } catch (error) {
      setMessage(
        "Unable to connect to the MINEPTHE server. Make sure the backend is running."
      );
      setMessageType("error");
    }
  };

  const verifyOTP = async (event) => {
    event.preventDefault();

    if (!otp) {
      setMessage("Please enter the OTP.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/guest/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid OTP.");
        setMessageType("error");
        return;
      }

      setMessage(
        "Phone verified successfully. You can continue with your book donation."
      );
      setMessageType("success");

      setTimeout(() => {
        window.location.href = "/guest-donate/book";
      }, 1000);
    } catch (error) {
      setMessage(
        "Unable to connect to the MINEPTHE server. Make sure the backend is running."
      );
      setMessageType("error");
    }
  };

  return (
    <div className="guest-donate-page">

      <header className="guest-header">
        <Link to="/" className="guest-logo">
          MINEPTHE
        </Link>

        <Link to="/donate" className="guest-back">
          ← Back
        </Link>
      </header>

      <main className="guest-main">

        <div className="guest-card">

          <div className="guest-icon">
            📚
          </div>

          <p className="guest-label">
            GUEST DONOR
          </p>

          <h1>
            Donate a Book
          </h1>

          <p className="guest-description">
            You can donate a book without creating a MINEPTHE account.
            First, we need to verify your phone number.
          </p>

          <div className="guest-steps">

            <div className="guest-step active">
              <span>1</span>
              <p>Phone Verification</p>
            </div>

            <div className="guest-step">
              <span>2</span>
              <p>Book Details</p>
            </div>

            <div className="guest-step">
              <span>3</span>
              <p>Verification</p>
            </div>

            <div className="guest-step">
              <span>4</span>
              <p>Collection</p>
            </div>

          </div>

          {!otpSent ? (
            <form onSubmit={sendOTP}>

              <div className="guest-form-group">
                <label htmlFor="guest-phone">
                  Phone Number
                </label>

                <input
                  id="guest-phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setMessage("");
                  }}
                  maxLength="10"
                />

                <small>
                  Your phone number will remain private.
                </small>
              </div>

              {message && (
                <div className={`guest-message ${messageType}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="guest-button"
              >
                Send Demo OTP
              </button>

            </form>
          ) : (
            <form onSubmit={verifyOTP}>

              <div className="guest-phone-display">
                OTP sent for:
                <strong> +91 {phone}</strong>
              </div>

              <div className="guest-form-group">
                <label htmlFor="guest-otp">
                  Enter OTP
                </label>

                <input
                  id="guest-otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(event) => {
                    setOtp(event.target.value);
                    setMessage("");
                  }}
                  maxLength="6"
                />

                <small>
                  For this demo, the OTP is displayed in the backend
                  terminal.
                </small>
              </div>

              {message && (
                <div className={`guest-message ${messageType}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="guest-button"
              >
                Verify Phone
              </button>

              <button
                type="button"
                className="change-phone"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setMessage("");
                }}
              >
                Change Phone Number
              </button>

            </form>
          )}

          <div className="guest-safety">
            <strong>Privacy & Safety</strong>
            <p>
              MINEPTHE does not publicly display your phone number.
              It is used only for the guest donation verification process.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default GuestDonate;