import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";

import { store } from "./store";
import { getCurrentUser, logout } from "./features/auth/authSlice";
import {
    getWaitingListPosition,
    onUpdateLivecall,
} from "./features/livecall/livecallSlice";

import { useIdleTimer } from "react-idle-timer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VideoChat from "./pages/VideoChat";
import TwoFactorAuthPage from "./pages/TwoFactorAuthPage";
import ErrorPage from "./pages/ErrorPage";
import AgentsTable from "./pages/DashboardPage/AgentsTable";
import ProfileForm from "./pages/DashboardPage/ProfileForm";
import LiveCallTable from "./pages/DashboardPage/LiveCallTable";
import CallBackTable from "./pages/DashboardPage/CallBackTable";
import FeedbackTable from "./pages/DashboardPage/FeedbackTable";
import ChangePasswordForm from "./pages/DashboardPage/ChangePasswordForm";

import axios from "axios";
import IdleDialog from "./components/IdleDialog";
import Survey from "./pages/HomePage/Survey";
import TicketsTable from "./pages/DashboardPage/TicketsTable";
import GuestRoute from "./utils/GuestRoute";
import AuthRoute from "./utils/AuthRoute";
import AgentPage from "./pages/DashboardPage/AgentPage";
import UserTable from "./pages/DashboardPage/UserTable";
import MainDashboard from "./pages/DashboardPage/MainDashboard";
import NotificationPreference from "./pages/DashboardPage/NotificationPreference";
import NotificationPage from "./pages/DashboardPage/NotificationPage";
import PerformanceTracking from "./pages/DashboardPage/PerformanceTracking";
import ReportPage from "./pages/DashboardPage/ReportPage";

const timeout = 500_000;
const promptBeforeIdle = 20_000;

const App = (props) => {
    const [remaining, setRemaining] = useState(timeout);
    const [open, setOpen] = useState(false);
    const [auth, setAuth] = useState(store.getState().auth);

    useEffect(() => {
        store.dispatch(getCurrentUser());
    }, []);

    const onIdle = () => {
        if (auth.user) {
            store.dispatch(logout());
            setOpen(false);
        }
    };

    const onActive = () => {
        if (auth.user) {
            store.dispatch(getCurrentUser());
            setOpen(false);
        }
    };

    const onPrompt = () => {
        if (auth.user) {
            setOpen(true);
        }
    };

    // const { getRemainingTime, activate } = useIdleTimer({
    //     onIdle,
    //     onActive,
    //     onPrompt,
    //     timeout,
    //     promptBeforeIdle,
    //     throttle: 500,
    // });

    useEffect(() => {
        window.Echo.channel("livecall").listen("LivecallUpdate", (e) => {
            store.dispatch(onUpdateLivecall(e.livecall));
            let livecall = store.getState().livecall.livecall;
            if (livecall && livecall.id) {
                store.dispatch(getWaitingListPosition(livecall.id));
            }
        });
    }, []);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setRemaining(Math.ceil(getRemainingTime() / 1000));
    //     }, 500);

    //     return () => {
    //         clearInterval(interval);
    //     };
    // });

    const handleStillHere = () => {
        activate();
    };

    useEffect(() => {
        if (auth.isAuthenticated) {
            const token = localStorage.getItem("device_token");
            if (token) {
                axios
                    .post("/save-token", { token })
                    .then((res) => {})
                    .catch((err) => console.log(err));
            }
        }
    }, [auth]);

    store.subscribe(() => setAuth(store.getState().auth));

    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route exact path="/" element={<HomePage />} />
                    <Route exact path="/callback/:id" element={<HomePage />} />
                    <Route
                        exact
                        path="/feedback/:channel/:id"
                        element={<Survey />}
                    />
                    <Route
                        exact
                        path="admin/two-factor-auth"
                        element={<TwoFactorAuthPage />}
                    />

                    <Route
                        exact
                        path="conferencing/:URLRoomID"
                        element={<VideoChat />}
                    />
                    <Route
                        exact
                        path="admin/forgot-password"
                        element={
                            <GuestRoute>
                                <ForgotPasswordPage />
                            </GuestRoute>
                        }
                    />
                    <Route
                        exact
                        path="admin/password/reset/:token"
                        element={
                            <GuestRoute>
                                <ResetPasswordPage />
                            </GuestRoute>
                        }
                    />
                    <Route path="admin">
                        <Route
                            exact
                            path=""
                            element={
                                <GuestRoute>
                                    <LoginPage />
                                </GuestRoute>
                            }
                        />
                        <Route path="dashboard">
                            <Route
                                path=""
                                element={
                                    <AuthRoute>
                                        <MainDashboard />
                                    </AuthRoute>
                                }
                            />
                            <Route path="agent">
                                <Route
                                    path=""
                                    element={
                                        <AuthRoute>
                                            <AgentsTable />
                                        </AuthRoute>
                                    }
                                />
                                <Route
                                    path=":id"
                                    element={
                                        <AuthRoute>
                                            <AgentPage />
                                        </AuthRoute>
                                    }
                                />
                            </Route>
                            <Route
                                path="performance-tracking"
                                element={
                                    <AuthRoute>
                                        <PerformanceTracking />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="notification-preference"
                                element={
                                    <AuthRoute>
                                        <NotificationPreference />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="notification-history"
                                element={
                                    <AuthRoute>
                                        <NotificationPage />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="account"
                                element={
                                    <AuthRoute>
                                        <UserTable />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="report"
                                element={
                                    <AuthRoute>
                                        <ReportPage />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="profile"
                                element={
                                    <AuthRoute>
                                        <ProfileForm />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="livecall"
                                element={
                                    <AuthRoute>
                                        <LiveCallTable />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="callback"
                                element={
                                    <AuthRoute>
                                        <CallBackTable />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="feedback"
                                element={
                                    <AuthRoute>
                                        <FeedbackTable />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="ticket"
                                element={
                                    <AuthRoute>
                                        <TicketsTable />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="change-password"
                                element={
                                    <AuthRoute>
                                        <ChangePasswordForm />
                                    </AuthRoute>
                                }
                            />
                        </Route>
                    </Route>
                    <Route path="/*" element={<ErrorPage />} />
                </Routes>
            </Router>
            {/* <IdleDialog
                open={open}
                remaining={remaining}
                onClose={handleStillHere}
            /> */}
            <ToastContainer />
        </Provider>
    );
};

export default App;

if (document.getElementById("app")) {
    const element = document.getElementById("app");

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        element
    );
}
