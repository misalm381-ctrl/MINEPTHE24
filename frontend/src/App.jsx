import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import AppShell from "./pages/AppShell.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Books from "./pages/Books.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import BookMatching from "./pages/BookMatching.jsx";
import SmartMatching from "./pages/SmartMatching.jsx";

import DonateBook from "./pages/DonateBook.jsx";
import DonateChoice from "./pages/DonateChoice.jsx";
import GuestDonate from "./pages/GuestDonate.jsx";
import GuestBookProcedure from "./pages/GuestBookProcedure.jsx";

import ReceiveBook from "./pages/ReceiveBook.jsx";
import ReceiverVerification from "./pages/ReceiverVerification.jsx";
import RequestBook from "./pages/RequestBook.jsx";

import MyRequests from "./pages/MyRequests.jsx";
import MyDonations from "./pages/MyDonations.jsx";
import ReceivedRequests from "./pages/ReceivedRequests.jsx";

import CollectionPoint from "./pages/CollectionPoint.jsx";
import CollectionVerification from "./pages/CollectionVerification.jsx";

import BookVerification from "./pages/BookVerification.jsx";
import SyllabusAnalysis from "./pages/SyllabusAnalysis.jsx";

import Exchange from "./pages/Exchange.jsx";
import SellBook from "./pages/SellBook.jsx";

import Profile from "./pages/Profile.jsx";
import Reputation from "./pages/Reputation.jsx";

import Notifications from "./pages/Notifications.jsx";
import Messages from "./pages/Messages.jsx";

import SafetyAnalysis from "./pages/SafetyAnalysis.jsx";
import SafetyReport from "./pages/SafetyReport.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserRestrictions from "./pages/UserRestrictions.jsx";
import BackendTest from "./pages/BackendTest.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* PUBLIC PAGES */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* APPLICATION PAGES */}

                <Route
                    path="/dashboard"
                    element={
                        <AppShell>
                            <Dashboard />
                        </AppShell>
                    }
                />

                <Route
                    path="/books"
                    element={
                        <AppShell>
                            <Books />
                        </AppShell>
                    }
                />

                <Route
                    path="/book-details/:id"
                    element={
                        <AppShell>
                            <BookDetails />
                        </AppShell>
                    }
                />
<Route
    path="/books/:id"
    element={
        <AppShell>
            <BookDetails />
        </AppShell>
    }
/>
                <Route
                    path="/book-matching"
                    element={
                        <AppShell>
                            <BookMatching />
                        </AppShell>
                    }
                />

                <Route
                    path="/smart-matching"
                    element={
                        <AppShell>
                            <SmartMatching />
                        </AppShell>
                    }
                />

                <Route
                    path="/donate"
                    element={
                        <AppShell>
                            <DonateBook />
                        </AppShell>
                    }
                />

               <Route
    path="/donate-book"
    element={
        <AppShell>
            <BookVerification />
        </AppShell>
    }
/>
<Route
    path="/donate-book-form"
    element={
        <AppShell>
            <DonateBook />
        </AppShell>
    }
/>
                <Route
                    path="/donate-choice"
                    element={
                        <AppShell>
                            <DonateChoice />
                        </AppShell>
                    }
                />

                <Route
                    path="/guest-donate"
                    element={
                        <AppShell>
                            <GuestDonate />
                        </AppShell>
                    }
                />

                <Route
                    path="/guest-book-procedure"
                    element={
                        <AppShell>
                            <GuestBookProcedure />
                        </AppShell>
                    }
                />

                <Route
                    path="/receive-book"
                    element={
                        <AppShell>
                            <ReceiveBook />
                        </AppShell>
                    }
                />

               <Route
    path="/find-books"
    element={
        <AppShell>
            <Books />
        </AppShell>
    }
/>

                <Route
                    path="/receiver-verification"
                    element={
                        <AppShell>
                            <ReceiverVerification />
                        </AppShell>
                    }
                />

                <Route
                    path="/request-book"
                    element={
                        <AppShell>
                            <RequestBook />
                        </AppShell>
                    }
                />

                <Route
                    path="/my-requests"
                    element={
                        <AppShell>
                            <MyRequests />
                        </AppShell>
                    }
                />

                <Route
                    path="/my-donations"
                    element={
                        <AppShell>
                            <MyDonations />
                        </AppShell>
                    }
                />

                <Route
                    path="/received-requests"
                    element={
                        <AppShell>
                            <ReceivedRequests />
                        </AppShell>
                    }
                />

                <Route
                    path="/collection-point"
                    element={
                        <AppShell>
                            <CollectionPoint />
                        </AppShell>
                    }
                />

                <Route
                    path="/collection-verification"
                    element={
                        <AppShell>
                            <CollectionVerification />
                        </AppShell>
                    }
                />

                <Route
                    path="/book-verification"
                    element={
                        <AppShell>
                            <BookVerification />
                        </AppShell>
                    }
                />

                <Route
                    path="/syllabus-analysis"
                    element={
                        <AppShell>
                            <SyllabusAnalysis />
                        </AppShell>
                    }
                />

                <Route
                    path="/exchange"
                    element={
                        <AppShell>
                            <Exchange />
                        </AppShell>
                    }
                />

                <Route
                    path="/sell-book"
                    element={
                        <AppShell>
                            <SellBook />
                        </AppShell>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <AppShell>
                            <Profile />
                        </AppShell>
                    }
                />

                <Route
                    path="/reputation"
                    element={
                        <AppShell>
                            <Reputation />
                        </AppShell>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <AppShell>
                            <Notifications />
                        </AppShell>
                    }
                />

                <Route
                    path="/messages"
                    element={
                        <AppShell>
                            <Messages />
                        </AppShell>
                    }
                />

                <Route
                    path="/safety-analysis"
                    element={
                        <AppShell>
                            <SafetyAnalysis />
                        </AppShell>
                    }
                />

                <Route
                    path="/safety-report"
                    element={
                        <AppShell>
                            <SafetyReport />
                        </AppShell>
                    }
                />

                <Route
                    path="/report-issue"
                    element={
                        <AppShell>
                            <ReportIssue />
                        </AppShell>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <AppShell>
                            <AdminDashboard />
                        </AppShell>
                    }
                />

                <Route
                    path="/user-restrictions"
                    element={
                        <AppShell>
                            <UserRestrictions />
                        </AppShell>
                    }
                />
<Route
    path="/admin-login"
    element={<AdminLogin />}
/>
                <Route
                    path="/backend-test"
                    element={
                        <AppShell>
                            <BackendTest />
                        </AppShell>
                    }
                />


                {/* FALLBACK */}

                <Route
                    path="*"
                    element={<Home />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
