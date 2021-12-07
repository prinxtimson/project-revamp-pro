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
export const loginUser = (email, password, history) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    //const body = JSON.stringify({ email, password });

    try {
        await axios.get(`/sanctum/csrf-cookie`);

        const res = await axios.post("/login", { email, password });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });

        history.replace("/dashboard");
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LOGIN_FAIL });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
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
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

// Register user action
export const registerUser = (formData, handleSuccess) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = JSON.stringify(formData);

    try {
        const res = await axios.post("/api/register", body, config);

        dispatch(setAlert(res.data.message, "success"));

        handleSuccess();
    } catch (err) {
        console.log(err.response);
        dispatch({ type: AUTH_LOADING });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
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
        const res = await axios.put("/api/change-password", body, config);

        dispatch(setAlert(res.data.message, "success"));
        window.location.reload();
    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

// Request Password reset action
export const requestPasswordReset =
    (email, handleSuccess) => async (dispatch) => {
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
            if (err.response.status == 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "danger")
                );
            }

            dispatch(setAlert(err.response.data.message, "danger"));
        }
    };

// Reset password action
export const resetPassword = (data, token, history) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = JSON.stringify({ ...data, token });
    try {
        const res = await axios.post("/password/update", body, config);

        dispatch(
            setAlert("Your password had been updated successfully.", "success")
        );

        history.replace("/");
    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500) {
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
            dispatch({ type: LOGOUT_USER });
            history.replace("/");
        } catch (err) {
            console.log(err.response);
            if (err.response.status == 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "danger")
                );
            }

            dispatch(setAlert(err.response.data.message, "danger"));
        }
    }
};

// Logout user action
export const logoutUser = (history) => async (dispatch) => {
    try {
        await axios.post(`/logout`);
        dispatch({ type: LOGOUT_USER });
        dispatch({ type: CLEAR_PROFILE });
        history.replace("/");
    } catch (err) {
        console.log(err.response);
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};
