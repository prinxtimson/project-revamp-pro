import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import { loadUser, onNewNotification } from "./actions/auth";
import { updateLivecalls } from "./actions/livecall";

import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import LiveSupportPage from "./pages/LiveSupportPage";
import VideoChat from "./pages/VideoChat";
import TwoFactorAuthPage from "./pages/TwoFactorAuthPage";
import OpenTok from "./pages/OpenTok";

const App = (props) => {
    const [auth, setAuth] = useState(store.getState().auth);

    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    useEffect(() => {
        window.Echo.channel("livecall").listen("LivecallUpdate", (e) => {
            store.dispatch(updateLivecalls(e.livecall));
        });
    }, []);

    store.subscribe(() => {
        setAuth(store.getState().auth);
    });

    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route
                        exact
                        path="live-support"
                        element={<LiveSupportPage />}
                    />
                    <Route
                        exact
                        path="admin/two-factor-auth"
                        element={<TwoFactorAuthPage {...props} />}
                    />
                    <Route exact path="admin" element={<LoginPage />} />
                    <Route
                        exact
                        path="confrencing/:URLRoomID"
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
                    <Route
                        path="admin/dashboard/*"
                        element={<DashboardPage />}
                    />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;

if (document.getElementById("app")) {
    const element = document.getElementById("app");

    const props = Object.assign({}, element.dataset);

    ReactDOM.render(<App {...props} />, element);
}
