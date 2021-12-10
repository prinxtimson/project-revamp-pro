const axios = window.axios;
import { setAlert } from "./alert";
import {
    CLEAR_LIVECALL,
    DELETE_LIVECALL,
    LIVECALL_ERROR,
    LIVECALL_LOADING,
    SET_LIVECALL,
    SET_LIVECALLS,
} from "./types";

export const getLivecalls = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/livecall");

        dispatch({
            type: SET_LIVECALLS,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const requestLivecall = (data) => async (dispatch) => {
    dispatch({ type: LIVECALL_LOADING });
    try {
        const res = await axios.post("/api/livecall", data);

        dispatch({
            type: SET_LIVECALL,
            payload: res.data,
        });

        dispatch(setAlert("You are connected", "success"));
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const getLivecallById = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/livecall/${id}`);

        dispatch({
            type: SET_LIVECALL,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const delLivecall = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/livecall/${id}`);

        dispatch({
            type: DELETE_LIVECALL,
            payload: id,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const clearLivecall = () => (dispatch) => {
    dispatch({ type: CLEAR_LIVECALL });
};
