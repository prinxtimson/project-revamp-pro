const axios = window.axios;
import { setAlert } from "./alert";
import {
    AUTH_ERROR,
    USER_LOADED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_USER,
    CLEAR_PROFILE,
    AUTH_LOADING,
    ON_NEW_NOTIFICATION,
    ON_READ_NOTIFICATION,
} from "./types";

// Load authenticated user action
export const loadUser = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/me");

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });

        // dispatch(getNotifications());
    } catch (err) {
        console.log(err.response);

        dispatch({ type: AUTH_ERROR });
    }
};

export const onNewNotification = (notification) => (dispatch) => {
    dispatch({
        type: ON_NEW_NOTIFICATION,
        payload: notification,
    });
};

export const onNotificationRead = () => async (dispatch) => {
    try {
        let res = await axios.get(`/api/mark-notification`);

        dispatch({ type: ON_READ_NOTIFICATION, payload: res.data });
    } catch (err) {
        console.log(err.response);
    }
};

//Login user action
export const loginUser = (email, password) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    try {
        await axios.get(`/sanctum/csrf-cookie`);

        await axios.post("/login", { email, password });

        location.href = "/admin/two-factor-auth";
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LOGIN_FAIL });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const verifyCode = (data) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });
    try {
        await axios.post("/two-factor-auth", data);
        dispatch({ type: AUTH_LOADING });
        dispatch(setAlert("Verification successful", "success"));
        //location.reload();
        location.href = "/admin/dashboard";
    } catch (err) {
        console.log(err.response);
        dispatch({ type: AUTH_LOADING });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data, "danger"));
    }
};

export const resendCode = (onCodeResend) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });
    try {
        await axios.get("/two-factor-auth/resent");
        dispatch({ type: AUTH_LOADING });
        onCodeResend();
        dispatch(setAlert("New verification code sent", "success"));
    } catch (err) {
        console.log(err.response);
        dispatch({ type: AUTH_LOADING });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }
        if (err.response.status === 401 || err.response.status === 403) {
            window.location.reload();
        }
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const updateUser = (data) => async (dispatch) => {
    try {
        dispatch({ type: AUTH_LOADING });

        const res = await axios.post(`/api/update`, data);

        dispatch(setAlert("Profile updated successfuly", "success"));

        dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: AUTH_LOADING });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }
        if (err.response.status === 401 || err.response.status === 403) {
            window.location.reload();
        }
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

// Register user action
export const addUser = (formData, handleSuccess) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    try {
        const res = await axios.post("/api/users", formData);

        dispatch(setAlert("Admin added successfuly", "success"));

        dispatch({ type: AUTH_LOADING });

        handleSuccess();
    } catch (err) {
        console.log(err.response);
        dispatch({ type: AUTH_LOADING });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }
        if (err.response.status === 401 || err.response.status === 403) {
            window.location.reload();
        }
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const changePassword = (data) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = JSON.stringify(data);

    try {
        const res = await axios.put("/change-password", body, config);

        dispatch(setAlert(res.data.message, "success"));
        window.location.reload();
    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }
        if (err.response.status === 401 || err.response.status === 403) {
            window.location.reload();
        }
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

// Request Password reset action
export const requestPasswordReset =
    (email, handleSuccess, handleError) => async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify({ email });

        try {
            const res = await axios.post("/password/email", body, config);

            dispatch(
                setAlert(
                    "An email has been sent to you, please check your email.",
                    "success"
                )
            );
            handleSuccess();
        } catch (err) {
            console.log(err.response);
            handleError();
            if (err.response.status == 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "danger")
                );
            }

            dispatch(setAlert(err.response.data.message, "danger"));
        }
    };

// Reset password action
export const resetPassword =
    (data, onSuccessful, setLoading) => async (dispatch) => {
        try {
            const res = await axios.post("/password/update", data);

            dispatch(
                setAlert(
                    "Your password had been updated successfully.",
                    "success"
                )
            );

            onSuccessful();

            setLoading(false);

            window.location.replace("/");
        } catch (err) {
            console.log(err.response);
            setLoading(false);
            if (err.response.status === 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "danger")
                );
            }

            dispatch(setAlert(err.response.data.message, "danger"));
        }
    };

export const deleteAccount = () => async (dispatch) => {
    if (window.confirm("Are you sure? This can NOT be undone!")) {
        try {
            await axios.delete(`/delete-account`);
            window.location.reload();
        } catch (err) {
            console.log(err.response);
            if (err.response.status === 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "danger")
                );
            }
            if (err.response.status === 401 || err.response.status === 403) {
                window.location.reload();
            }
            dispatch(setAlert(err.response.data.message, "danger"));
        }
    }
};

// Logout user action
export const logoutUser = () => async (dispatch) => {
    try {
        await axios.post(`/logout`);
        window.location.reload();
    } catch (err) {
        console.log(err.response);
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};
