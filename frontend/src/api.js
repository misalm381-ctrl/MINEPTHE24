const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";


/* =========================================================
   COMMON API REQUEST
========================================================= */

async function apiRequest(endpoint, options = {}) {
    const {
        method = "GET",
        body,
        headers = {}
    } = options;

    const requestOptions = {
        method,
        headers: {
            ...headers
        }
    };

    if (body !== undefined && body !== null) {
        requestOptions.headers["Content-Type"] =
            "application/json";

        requestOptions.body =
            typeof body === "string"
                ? body
                : JSON.stringify(body);
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        requestOptions
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            `Request failed with status ${response.status}`
        );
    }

    return data;
}


/* =========================================================
   AUTHENTICATION
========================================================= */

export async function registerUser(data) {
    return apiRequest("/api/register", {
        method: "POST",
        body: data
    });
}

export async function loginUser(data) {
    return apiRequest("/api/login", {
        method: "POST",
        body: data
    });
}


/* =========================================================
   GUEST OTP
========================================================= */

export async function sendGuestOTP(data) {
    const body =
        typeof data === "string"
            ? { phone: data }
            : data;

    return apiRequest("/api/guest/send-otp", {
        method: "POST",
        body
    });
}

export async function verifyGuestOTP(phoneOrData, otp) {
    const body =
        typeof phoneOrData === "object"
            ? phoneOrData
            : {
                phone: phoneOrData,
                otp
            };

    return apiRequest("/api/guest/verify-otp", {
        method: "POST",
        body
    });
}


/* =========================================================
   GUEST DONATION
========================================================= */

export async function donateGuestBook(data) {
    return apiRequest("/api/guest/donate-book", {
        method: "POST",
        body: data
    });
}


/* =========================================================
   BOOKS
========================================================= */

export async function getBooks() {
    return apiRequest("/api/books");
}

export async function getBook(bookId) {
    return apiRequest(`/api/books/${bookId}`);
}

export async function donateBook(data) {
    return apiRequest("/api/books/donate", {
        method: "POST",
        body: data
    });
}

export async function getMyDonations(userId) {
    return apiRequest(`/api/books/user/${userId}`);
}


/* =========================================================
   AI BOOK ANALYSIS
========================================================= */

export async function analyzeBookImage(image) {
    return apiRequest("/api/ai/analyze-book", {
        method: "POST",
        body: {
            image
        }
    });
}

export async function analyzeBook(image) {
    return analyzeBookImage(image);
}


/* =========================================================
   AI SYLLABUS ANALYSIS
========================================================= */

export async function analyzeSyllabus(data) {
    return apiRequest("/api/ai/analyze-syllabus", {
        method: "POST",
        body: data
    });
}


/* =========================================================
   SMART BOOK MATCHING
========================================================= */

export async function matchBooks(data) {
    return apiRequest("/api/books/match", {
        method: "POST",
        body: data
    });
}


/* =========================================================
   BOOK REQUESTS
========================================================= */

export async function createRequest(data) {
    return apiRequest("/api/requests", {
        method: "POST",
        body: data
    });
}

export async function getRequests(userId) {
    return apiRequest(
        `/api/requests?requesterId=${userId}`
    );
}

export async function getReceivedRequests(userId) {
    return apiRequest(
        `/api/requests?donorId=${userId}`
    );
}

export async function updateRequestStatus(
    requestId,
    status
) {
    return apiRequest(
        `/api/requests/${requestId}/status`,
        {
            method: "PATCH",
            body: {
                status
            }
        }
    );
}

export async function deleteRequest(requestId) {
    return apiRequest(
        `/api/requests/${requestId}`,
        {
            method: "DELETE"
        }
    );
}


/* =========================================================
   RECEIVER VERIFICATION
========================================================= */

export async function submitReceiverVerification(data) {
    return apiRequest(
        "/api/receiver-verification",
        {
            method: "POST",
            body: data
        }
    );
}

export async function getReceiverVerification(userId) {
    return apiRequest(
        `/api/receiver-verification/${userId}`
    );
}

export async function getStudentProfile(userId) {
    return apiRequest(
        `/api/student-profile/${userId}`
    );
}


/* =========================================================
   COLLECTION POINTS
========================================================= */

export async function getCollectionPoints() {
    return apiRequest(
        "/api/collection-points"
    );
}

export async function createCollectionPoint(data) {
    return apiRequest(
        "/api/collection-points",
        {
            method: "POST",
            body: data
        }
    );
}


/* =========================================================
   HANDOVERS / COLLECTION
========================================================= */

export async function createHandover(requestId) {
    const body =
        typeof requestId === "object"
            ? requestId
            : {
                requestId
            };

    return apiRequest(
        "/api/handovers",
        {
            method: "POST",
            body
        }
    );
}

export async function verifyCollectionCode(
    requestId,
    collectionCode
) {
    const body =
        typeof requestId === "object"
            ? requestId
            : {
                requestId,
                collectionCode
            };

    return apiRequest(
        "/api/handovers/verify-code",
        {
            method: "POST",
            body
        }
    );
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

export async function getNotifications(userId) {
    return apiRequest(
        `/api/notifications/${userId}`
    );
}

export async function markNotificationRead(
    notificationId
) {
    return apiRequest(
        `/api/notifications/${notificationId}/read`,
        {
            method: "PATCH"
        }
    );
}


/* =========================================================
   MESSAGES
========================================================= */

export async function getMessages(userId) {
    return apiRequest(
        `/api/messages/${userId}`
    );
}

export async function sendMessage(data) {
    return apiRequest(
        "/api/messages",
        {
            method: "POST",
            body: data
        }
    );
}


/* =========================================================
   REPORTS
========================================================= */

export async function submitReport(data) {
    return apiRequest(
        "/api/reports",
        {
            method: "POST",
            body: data
        }
    );
}

export async function createReport(data) {
    return apiRequest(
        "/api/reports",
        {
            method: "POST",
            body: data
        }
    );
}


/* =========================================================
   REPUTATION
========================================================= */

export async function getReputation(userId) {
    return apiRequest(
        `/api/reputation/${userId}`
    );
}


/* =========================================================
   SAFETY
========================================================= */

export async function getSafetyRecords(userId) {
    return apiRequest(
        `/api/safety/${userId}`
    );
}

export async function getSafety(userId) {
    return getSafetyRecords(userId);
}


/* =========================================================
   ADMIN
========================================================= */

export async function verifyBook(bookId) {
    const token =
        localStorage.getItem("mineptheAdminToken");

    return apiRequest(
        `/api/admin/books/${bookId}/verify`,
        {
            method: "PATCH",
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
}

export async function getAdminBooks() {
    const token =
        localStorage.getItem(
            "mineptheAdminToken"
        );

    return apiRequest(
        "/api/admin/books",
        {
            method: "GET",
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
}

export async function getAdminOverview() {
    const token =
        localStorage.getItem(
            "mineptheAdminToken"
        );

    return apiRequest(
        "/api/admin/overview",
        {
            method: "GET",
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
}

export async function getAdminMe() {
    const token =
        localStorage.getItem(
            "mineptheAdminToken"
        );

    return apiRequest(
        "/api/admin/me",
        {
            method: "GET",
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );
}

export async function changeAdminPassword(
    currentPassword,
    newPassword
) {
    const token =
        localStorage.getItem(
            "mineptheAdminToken"
        );

    return apiRequest(
        "/api/admin/change-password",
        {
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${token}`
            },
            body: {
                currentPassword,
                newPassword
            }
        }
    );
}


/* =========================================================
   DEFAULT API OBJECT
========================================================= */

const api = {
    registerUser,
    loginUser,

    sendGuestOTP,
    verifyGuestOTP,
    donateGuestBook,

    getBooks,
    getBook,
    donateBook,
    getMyDonations,

    analyzeBookImage,
    analyzeBook,
    analyzeSyllabus,

    matchBooks,

    createRequest,
    getRequests,
    getReceivedRequests,
    updateRequestStatus,
    deleteRequest,

    submitReceiverVerification,
    getReceiverVerification,
    getStudentProfile,

    getCollectionPoints,
    createCollectionPoint,

    createHandover,
    verifyCollectionCode,

    getNotifications,
    markNotificationRead,

    getMessages,
    sendMessage,

    submitReport,
    createReport,

    getReputation,
    getSafetyRecords,
    getSafety,

    getAdminBooks,
    verifyBook,
    getAdminOverview,
    getAdminMe,
    changeAdminPassword
};

export default api;
