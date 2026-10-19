import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCollectionPoints,
    createCollectionPoint
} from "../api";

function CollectionPoint() {
    const navigate = useNavigate();

    const [points, setPoints] = useState([]);
    const [pointName, setPointName] = useState("");
    const [pointType, setPointType] = useState("");
    const [area, setArea] = useState("");
    const [instructions, setInstructions] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingPoints, setLoadingPoints] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadCollectionPoints();
    }, []);

    async function loadCollectionPoints() {
        try {
            setLoadingPoints(true);
            setError("");

            const result = await getCollectionPoints();

            const list = Array.isArray(result)
                ? result
                : Array.isArray(result?.collectionPoints)
                    ? result.collectionPoints
                    : Array.isArray(result?.points)
                        ? result.points
                        : [];

            setPoints(list);
        } catch (err) {
            setError(
                err.message ||
                "Unable to load collection points."
            );
        } finally {
            setLoadingPoints(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSuccess("");
        setError("");

        if (!pointName.trim()) {
            setError("Collection point name is required.");
            return;
        }

        if (!pointType) {
            setError("Please select a collection point type.");
            return;
        }

        if (!area.trim()) {
            setError("Area/location is required.");
            return;
        }

        try {
            setLoading(true);

            await createCollectionPoint({
                name: pointName.trim(),
                type: pointType,
                area: area.trim(),
                instructions: instructions.trim(),
                safetyStatus: "pending"
            });

            setSuccess(
                "Collection point submitted for safety verification."
            );

            setPointName("");
            setPointType("");
            setArea("");
            setInstructions("");

            await loadCollectionPoints();
        } catch (err) {
            setError(
                err.message ||
                "Unable to create collection point."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>Safe Collection Point</h1>

                <p>
                    Choose a public or approved location
                    for book handover.
                </p>
            </div>

            <div
                style={{
                    maxWidth: "800px",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "20px"
                }}
            >
                <strong>Collection Safety</strong>

                <p>
                    MINEPTHE should use public or
                    institution-approved collection points.
                    Do not share private home addresses.
                </p>
            </div>

            {success && (
                <div
                    style={{
                        maxWidth: "800px",
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        color: "#065f46",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "20px"
                    }}
                >
                    {success}
                </div>
            )}

            {error && (
                <div
                    style={{
                        maxWidth: "800px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#991b1b",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "20px"
                    }}
                >
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    maxWidth: "800px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "20px"
                }}
            >
                <h2>Collection Point Details</h2>

                <label>
                    <strong>Collection Point Name *</strong>
                </label>

                <input
                    type="text"
                    value={pointName}
                    onChange={(event) =>
                        setPointName(event.target.value)
                    }
                    placeholder="Example: College Library"
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        marginTop: "8px",
                        marginBottom: "18px",
                        padding: "12px"
                    }}
                />

                <label>
                    <strong>Collection Point Type *</strong>
                </label>

                <select
                    value={pointType}
                    onChange={(event) =>
                        setPointType(event.target.value)
                    }
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        marginTop: "8px",
                        marginBottom: "18px",
                        padding: "12px"
                    }}
                >
                    <option value="">
                        Select collection point
                    </option>

                    <option value="College / School">
                        College / School
                    </option>

                    <option value="College Library">
                        College Library
                    </option>

                    <option value="Public Library">
                        Public Library
                    </option>

                    <option value="Local Shop">
                        Local Shop
                    </option>

                    <option value="Dairy / Store">
                        Dairy / Store
                    </option>

                    <option value="Community Point">
                        Community Point
                    </option>

                    <option value="Other Public Place">
                        Other Public Place
                    </option>
                </select>

                <label>
                    <strong>Area / Location *</strong>
                </label>

                <input
                    type="text"
                    value={area}
                    onChange={(event) =>
                        setArea(event.target.value)
                    }
                    placeholder="Example: Pimpri"
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        marginTop: "8px",
                        marginBottom: "18px",
                        padding: "12px"
                    }}
                />

                <label>
                    <strong>Collection Instructions</strong>
                </label>

                <textarea
                    value={instructions}
                    onChange={(event) =>
                        setInstructions(event.target.value)
                    }
                    placeholder="Example: Ask the shop owner for the MINEPTHE collection package."
                    rows="5"
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        marginTop: "8px",
                        marginBottom: "20px",
                        padding: "12px",
                        resize: "vertical"
                    }}
                />

                <div
                    style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "20px"
                    }}
                >
                    <strong>Safety Rules</strong>

                    <ul>
                        <li>
                            Use a public or
                            institution-approved location.
                        </li>

                        <li>
                            Avoid private residential addresses.
                        </li>

                        <li>
                            The point should be reasonably
                            accessible to the receiver.
                        </li>

                        <li>
                            Personal contact information
                            should not be required.
                        </li>
                    </ul>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Submitting..."
                        : "Submit Collection Point"}
                </button>
            </form>

            <div
                style={{
                    maxWidth: "800px",
                    marginTop: "25px"
                }}
            >
                <h2>Available Collection Points</h2>

                {loadingPoints ? (
                    <p>Loading collection points...</p>
                ) : points.length === 0 ? (
                    <p>
                        No collection points are available yet.
                    </p>
                ) : (
                    points.map((point) => (
                        <div
                            key={point.id}
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "16px",
                                marginBottom: "12px",
                                background: "#ffffff"
                            }}
                        >
                            <h3>
                                {point.name ||
                                    point.point_name ||
                                    "Collection Point"}
                            </h3>

                            <p>
                                <strong>Type:</strong>{" "}
                                {point.type ||
                                    point.point_type ||
                                    "Public Place"}
                            </p>

                            <p>
                                <strong>Area:</strong>{" "}
                                {point.area ||
                                    point.location ||
                                    "Not specified"}
                            </p>

                            {(
                                point.instructions ||
                                point.collection_instructions
                            ) && (
                                <p>
                                    <strong>Instructions:</strong>{" "}
                                    {point.instructions ||
                                        point.collection_instructions}
                                </p>
                            )}

                            <p>
                                <strong>Safety:</strong>{" "}
                                {point.safety_status ||
                                    point.safetyStatus ||
                                    "pending"}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: "20px" }}>
                <button
                    type="button"
                    onClick={() => navigate("/exchange")}
                >
                    Back to Exchange
                </button>
            </div>

        </div>
    );
}

export default CollectionPoint;