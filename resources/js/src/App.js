import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import { loadUser, onNewNotification } from "./actions/auth";

import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
    const [auth, setAuth] = useState(store.getState().auth);

    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    useEffect(() => {
        if (auth.isAuthenticated) {
            // window.echo
            //     .private(`App.Models.User.${auth.user?.id}`)
            //     .notification((notification) => {
            //         store.dispatch(onNewNotification(notification));
            //     });
        }
    }, [auth]);

    store.subscribe(() => {
        setAuth(store.getState().auth);
    });

    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route exact path="/" element={<LoginPage />} />
                    <Route
                        exact
                        path="forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                    <Route
                        exact
                        path="reset-password/:token"
                        element={<ResetPasswordPage />}
                    />
                    <Route path="dashboard/*" element={<DashboardPage />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;

if (document.getElementById("app")) {
    ReactDOM.render(<App />, document.getElementById("app"));
}
