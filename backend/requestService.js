async function createRequest(db, requestData) {
    const {
        bookId,
        requesterId,
        collectionLocation,
        collectionPointId,
        donorCollectionMessage
    } = requestData;

    if (!bookId) {
        throw new Error("Book ID is required.");
    }

    if (!requesterId) {
        throw new Error("Requester ID is required.");
    }

    const [result] = await db.execute(
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
            bookId,
            requesterId,
            collectionLocation || null,
            collectionPointId || null,
            donorCollectionMessage || null
        ]
    );

    const [rows] = await db.execute(
        `SELECT *
         FROM book_requests
         WHERE id = ?`,
        [result.insertId]
    );

    return rows[0];
}


async function getRequests(
    db,
    requesterId = null,
    donorId = null
) {
    let query = `
        SELECT
            br.*,
            b.title AS book_title,
            b.author AS book_author,
            b.donor_id,
            u.name AS requester_name
        FROM book_requests br
        INNER JOIN books b
            ON br.book_id = b.id
        LEFT JOIN users u
            ON br.requester_id = u.id
    `;

    const values = [];
    const conditions = [];

    if (requesterId) {
        conditions.push(
            "br.requester_id = ?"
        );

        values.push(
            Number(requesterId)
        );
    }

    if (donorId) {
        conditions.push(
            "b.donor_id = ?"
        );

        values.push(
            Number(donorId)
        );
    }

    if (conditions.length > 0) {
        query +=
            " WHERE " +
            conditions.join(" AND ");
    }

    query += " ORDER BY br.id DESC";

    const [rows] =
        await db.execute(
            query,
            values
        );

    return rows;
}


async function getRequestById(db, id) {
    const [rows] = await db.execute(
        `SELECT *
         FROM book_requests
         WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
}


async function updateRequestStatus(db, id, status) {
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

    const [result] = await db.execute(
        `UPDATE book_requests
         SET status = ?
         WHERE id = ?`,
        [status, id]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getRequestById(db, id);
}


async function deleteRequest(db, id) {
    const [result] = await db.execute(
        `DELETE FROM book_requests
         WHERE id = ?`,
        [id]
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

