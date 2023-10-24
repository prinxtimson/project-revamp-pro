import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "../../css/app.css";

import store from "./store";
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
import DashboardPage from "./pages/DashboardPage/Dashboard";
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
                        path="/feedback/:channel"
                        element={<Survey />}
                    />
                    <Route
                        exact
                        path="admin/two-factor-auth"
                        element={<TwoFactorAuthPage {...props} />}
                    />

                    <Route
                        exact
                        path="conferencing/:URLRoomID"
                        element={<VideoChat />}
                    />
                    <Route
                        exact
                        path="admin/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                    <Route
                        exact
                        path="admin/password/reset/:token"
                        element={<ResetPasswordPage />}
                    />
                    <Route path="admin">
                        <Route exact path="" element={<LoginPage />} />
                        <Route path="dashboard">
                            <Route path="" element={<DashboardPage />} />
                            <Route path="account" element={<AgentsTable />} />
                            <Route path="profile" element={<ProfileForm />} />
                            <Route
                                path="livecall"
                                element={<LiveCallTable />}
                            />
                            <Route
                                path="callback"
                                element={<CallBackTable />}
                            />
                            <Route
                                path="feedback"
                                element={<FeedbackTable />}
                            />
                            <Route path="ticket" element={<TicketsTable />} />
                            <Route
                                path="change-password"
                                element={<ChangePasswordForm />}
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
        </Provider>
    );
};

export default App;

if (document.getElementById("app")) {
    const element = document.getElementById("app");

    //console.log(element.dataset);

    const props = Object.assign({}, element.dataset);

    ReactDOM.render(
        <React.StrictMode>
            <App {...props} />
        </React.StrictMode>,
        element
    );
}
