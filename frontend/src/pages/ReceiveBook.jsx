import React from "react";
import { useNavigate } from "react-router-dom";

function ReceiveBook() {
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="page-card">
                <h1>Receive Book</h1>

                <p>
                    Find academic books donated by other students and request
                    the books you need.
                </p>

                <div className="action-grid">
                    <button
                        type="button"
                        onClick={() => navigate("/books")}
                    >
                        Browse Available Books
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/receiver-verification")}
                    >
                        Receiver Verification
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/my-requests")}
                    >
                        My Book Requests
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReceiveBook;