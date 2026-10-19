const defaultDb = require("../config/db");

async function createRequest(db, requestData) {
    // Support calling createRequest(requestData) or createRequest(db, requestData)
    let client = db;
    let data = requestData;
    if (!data && db && typeof db === "object" && !db.execute) {
        data = db;
        client = defaultDb.pool;
    }
    if (!client || !client.execute) {
        client = defaultDb.pool;
    }

    const {
        bookId,
        requesterId,
        collectionLocation,
        collectionPointId,
        donorCollectionMessage
    } = data;

    if (!bookId) {
        throw new Error("Book ID is required.");
    }

    if (!requesterId) {
        throw new Error("Requester ID is required.");
    }

    const [result] = await client.execute(
        `INSERT INTO book_requests
        (
            book_id,
            requester_id,
            collection_location,
            collection_point_id,
            donor_collection_message
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            Number(bookId),
            Number(requesterId),
            collectionLocation || null,
            collectionPointId ? Number(collectionPointId) : null,
            donorCollectionMessage || null
        ]
    );

    const [rows] = await client.execute(
        `SELECT * FROM book_requests WHERE id = ?`,
        [result.insertId]
    );

    return rows[0];
}

async function getRequests(db, requesterId = null, donorId = null) {
    let client = db;
    if (!client || !client.execute) {
        client = defaultDb.pool;
    }

    let query = `
        SELECT
            br.*,
            b.title AS book_title,
            b.author AS book_author,
            b.donor_id,
            u.name AS requester_name
        FROM book_requests br
        INNER JOIN books b ON br.book_id = b.id
        LEFT JOIN users u ON br.requester_id = u.id
    `;

    const values = [];
    const conditions = [];

    if (requesterId) {
        conditions.push("br.requester_id = ?");
        values.push(Number(requesterId));
    }

    if (donorId) {
        conditions.push("b.donor_id = ?");
        values.push(Number(donorId));
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY br.id DESC";

    const [rows] = await client.execute(query, values);
    return rows;
}

async function getRequestById(db, id) {
    let client = db;
    if (!client || !client.execute) {
        client = defaultDb.pool;
    }

    const [rows] = await client.execute(
        `SELECT * FROM book_requests WHERE id = ?`,
        [Number(id)]
    );

    return rows[0] || null;
}

async function updateRequestStatus(db, id, status) {
    let client = db;
    if (!client || !client.execute) {
        client = defaultDb.pool;
    }

    const allowedStatuses = [
        "pending",
        "accepted",
        "rejected",
        "collected",
        "reported"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid request status.");
    }

    const [result] = await client.execute(
        `UPDATE book_requests SET status = ? WHERE id = ?`,
        [status, Number(id)]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getRequestById(client, id);
}

async function deleteRequest(db, id) {
    let client = db;
    if (!client || !client.execute) {
        client = defaultDb.pool;
    }

    const [result] = await client.execute(
        `DELETE FROM book_requests WHERE id = ?`,
        [Number(id)]
    );

    return result.affectedRows > 0;
}

module.exports = {
    createRequest,
    getRequests,
    getRequestById,
    updateRequestStatus,
    deleteRequest
};
