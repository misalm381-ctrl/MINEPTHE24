import { Link } from "react-router-dom";
import "./DonateChoice.css";

function DonateChoice() {
  return (
    <div className="donate-choice-page">

      <header className="donate-choice-header">
        <Link to="/" className="donate-choice-logo">
          MINEPTHE
        </Link>

        <Link to="/" className="donate-choice-home">
          ← Back to Home
        </Link>
      </header>

      <main className="donate-choice-main">

        <section className="donate-choice-intro">
          <p className="donate-choice-label">
            SHARE KNOWLEDGE
          </p>

          <h1>
            Donate a Book
          </h1>

          <p>
            Help another student discover a book they need.
            Choose how you would like to donate your book.
          </p>
        </section>

        <section className="donate-options">

          <div className="donate-option-card">

            <div className="donate-option-icon">
              ♙
            </div>

            <p className="option-label">
              RECOMMENDED
            </p>

            <h2>
              Donate with an Account
            </h2>

            <p>
              Use your MINEPTHE account to donate books,
              track your donations and manage your activity.
            </p>

            <ul>
              <li>Track your donations</li>
              <li>View donation history</li>
              <li>Manage your books</li>
              <li>Receive notifications</li>
            </ul>

            <Link
              to="/login"
              className="donate-option-button primary"
            >
              Login to Donate
            </Link>

            <Link
              to="/register"
              className="donate-register-link"
            >
              Don't have an account? Create one
            </Link>

          </div>


          <div className="donate-option-card guest-card">

            <div className="donate-option-icon">
              ♧
            </div>

            <p className="option-label guest-label">
              NO ACCOUNT REQUIRED
            </p>

            <h2>
              Continue as Guest Donor
            </h2>

            <p>
              Want to give away a book without creating an
              account? You can donate as a guest.
            </p>

            <ul>
              <li>No MINEPTHE account required</li>
              <li>Phone verification required</li>
              <li>Book information is verified</li>
              <li>Your phone number stays private</li>
            </ul>

            <Link
              to="/guest-donate"
              className="donate-option-button secondary"
            >
              Continue as Guest Donor
            </Link>

            <p className="guest-safety-note">
              Your personal information is handled privately
              and is not publicly displayed to students.
            </p>

          </div>

        </section>

      </main>

      <footer className="donate-choice-footer">
        <p>
          © 2026 MINEPTHE · Smart Academic Book Sharing & Matching System
        </p>
      </footer>

    </div>
  );
}

export default DonateChoice;



