import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/soho-light/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import { store } from "./store";
import { getCurrentUser, logout } from "./features/auth/authSlice";
import {
    getWaitingListPosition,
    onUpdateLivecall,
} from "./features/livecall/livecallSlice";

import { onMessageListener } from "./firebase";

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
import ProfilePage from "./pages/DashboardPage/ProfilePage";
import ActivityViewPage from "./pages/DashboardPage/ActivityViewPage";
import UploadProfileImage from "./pages/DashboardPage/UploadProfileImage";
import LivechatPage from "./pages/DashboardPage/LivechatPage";
import ELearningPage from "./pages/DashboardPage/ELearningPage";
import SingleTutorialPage from "./pages/DashboardPage/SingleTutorialPage";
import LogoutPage from "./pages/LogoutPage";

const App = () => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(store.getState().auth.user);

    useEffect(() => {
        store.dispatch(getCurrentUser());
    }, []);

    useEffect(() => {
        if (user) {
            window.Echo.private(`App.Models.User.${user?.id}`).listen(
                "",
                (e) => {}
            );

            onMessageListener().then((payload) => {
                const title = payload.notification.title;
                const options = {
                    body: payload.notification.body,
                    icon: "/images/logo.png",
                };
                new Notification(title, options);
            });
        }
    }, [user]);

    useEffect(() => {
        window.Echo.channel("livecall").listen("LivecallUpdate", (e) => {
            store.dispatch(onUpdateLivecall(e.livecall));
            let livecall = store.getState().livecall.livecall;
            if (livecall && livecall.id) {
                store.dispatch(getWaitingListPosition(livecall.id));
            }
        });
    }, []);

    store.subscribe(() => {
        setUser(store.getState().auth.user);
    });

    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route
                        exact
                        path="/feedback/:channel/:id"
                        element={<Survey />}
                    />
                    <Route
                        exact
                        path="/"
                        element={
                            <GuestRoute>
                                <LoginPage />
                            </GuestRoute>
                        }
                    />
                    <Route
                        exact
                        path="two-factor-auth"
                        element={<TwoFactorAuthPage />}
                    />

                    <Route
                        exact
                        path="conferencing/:URLRoomID"
                        element={<VideoChat />}
                    />
                    <Route
                        exact
                        path="forgot-password"
                        element={
                            <GuestRoute>
                                <ForgotPasswordPage />
                            </GuestRoute>
                        }
                    />
                    <Route
                        exact
                        path="password/reset/:token"
                        element={
                            <GuestRoute>
                                <ResetPasswordPage />
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
                                    <ProfilePage />
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="activities"
                            element={
                                <AuthRoute>
                                    <ActivityViewPage />
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="profile/edit"
                            element={
                                <AuthRoute>
                                    <ProfileForm />
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="profile/edit/upload"
                            element={
                                <AuthRoute>
                                    <UploadProfileImage />
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
                            path="livechat"
                            element={
                                <AuthRoute>
                                    <LivechatPage />
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="e-learning"
                            element={
                                <AuthRoute>
                                    <ELearningPage />
                                </AuthRoute>
                            }
                        />
                        <Route
                            path="e-learning/view/:id"
                            element={
                                <AuthRoute>
                                    <SingleTutorialPage />
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
                    <Route path="/*" element={<ErrorPage />} />
                </Routes>
            </Router>

            <ToastContainer />
        </Provider>
    );
};

export default App;

if (document.getElementById("app")) {
    const element = document.getElementById("app");

    ReactDOM.render(
        <PrimeReactProvider>
            <App />
        </PrimeReactProvider>,
        element
    );
}
