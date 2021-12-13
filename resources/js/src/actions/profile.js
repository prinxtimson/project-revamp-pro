const axios = window.axios;
import { setAlert } from "./alert";
import {
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    GET_PROFILES,
    PROFILE_LOADING,
    DELETE_PROFILE,
} from "./types";

// get current user profile
export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/me");

        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response?.statusText,
                status: err.response?.status,
            },
        });
    }
};

// get tutor profiles action
export const getAllProfiles = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/users");

        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });
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

export const enableUser = (id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/users/enable/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("User had been enabled successfully", "success"));
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

export const disableUser = (id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/users/disable/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("User had been disabled successfully", "success"));
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

export const approveUser = (id) => async (dispatch) => {
    try {
        await axios.put(`/api/users/approved/${id}`);

        dispatch(getAllProfiles());

        dispatch(setAlert("User had been approved successfully", "success"));
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

export const delUser = (id) => async (dispatch) => {
    if (
        window.confirm(
            "Are you sure you want to delete user? This can NOT be undone!"
        )
    ) {
        try {
            await axios.delete(`/api/users/${id}`);

            dispatch({
                type: DELETE_PROFILE,
                payload: id,
            });

            dispatch(setAlert("User had been deleted successfully", "success"));
        } catch (err) {
            console.log(err);
            if (err.response.status == 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "danger")
                );
            }

            dispatch(setAlert(err.response.data.message, "danger"));
        }
    }
};

export const clearProfile = () => (dispatch) => {
    dispatch({ type: CLEAR_PROFILE });
};
