const axios = window.axios;
import { setAlert } from "./alert";
import { leaveLivecall } from "./livecall";
import {
    CLEAR_CALLBACK,
    DELETE_CALLBACK,
    CALLBACK_ERROR,
    CALLBACK_LOADING,
    SET_CALLBACK,
    SET_CALLBACKS,
    UPDATE_CALLBACK,
} from "./types";

export const getCallbacks = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/callback");

        dispatch({
            type: SET_CALLBACKS,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: CALLBACK_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }
        // if (err.response.status === 401 || err.response.status === 403) {
        //     window.location.reload();
        // }
        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const getCallbacksByUrl = (url) => async (dispatch) => {
    try {
        const res = await axios.get(url);

        dispatch({
            type: SET_CALLBACKS,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: CALLBACK_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }
        // if (err.response.status === 401 || err.response.status === 403) {
        //     window.location.reload();
        // }
        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const getCallbacksByDate = (date) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/callback/search/${date}`);

        dispatch({
            type: SET_CALLBACKS,
            payload: { data: res.data },
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: CALLBACK_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }

        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const requestCallback = (id, data, onSuccessful) => async (dispatch) => {
    dispatch({ type: CALLBACK_LOADING });
    try {
        const res = await axios.post("/api/callback", data);

        onSuccessful();

        dispatch(setAlert("Callback request received", "success"));

        if (id) dispatch(leaveLivecall(id));

        dispatch({
            type: SET_CALLBACK,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: CALLBACK_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }

        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const getCallbackById = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/callback/${id}`);

        dispatch({
            type: SET_CALLBACK,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: CALLBACK_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }
        if (err.response.status == 401 || err.response.status == 403) {
            window.location.reload();
        }
        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const delCallback = (id) => async (dispatch) => {
    if (
        window.confirm(
            "Are you sure you want to delete callback? This can NOT be undone!"
        )
    ) {
        try {
            await axios.delete(`/api/callback/${id}`);

            dispatch({
                type: DELETE_CALLBACK,
                payload: id,
            });
        } catch (err) {
            console.log(err.response);
            dispatch({ type: CALLBACK_ERROR });
            if (err.response.status == 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "error")
                );
            }
            if (err.response.status == 401 || err.response.status == 403) {
                window.location.reload();
            }
            let msg = err.response.data.message || err.response.data;
            dispatch(setAlert(msg, "error"));
        }
    }
};

export const callbackSuccessful = (id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/callback/success/${id}`);

        dispatch({
            type: UPDATE_CALLBACK,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: CALLBACK_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }
        if (err.response.status == 401 || err.response.status == 403) {
            window.location.reload();
        }
        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const updateCallback =
    (id, data, onEditSuccessful) => async (dispatch) => {
        dispatch({ type: CALLBACK_LOADING });
        try {
            const res = await axios.put(`/api/callback/${id}`, data);

            onEditSuccessful();

            dispatch({
                type: UPDATE_CALLBACK,
                payload: res.data,
            });
            dispatch(setAlert("Callback request has been updated", "success"));
        } catch (err) {
            console.log(err.response);
            dispatch({ type: CALLBACK_ERROR });
            if (err.response.status == 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "error")
                );
            }
            dispatch(setAlert(err.response.data, "error"));
        }
    };

export const cancelCallback = (id, handleClose) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/callback/cancel/${id}`);

        dispatch({
            type: UPDATE_CALLBACK,
            payload: res.data,
        });
        handleClose();
        dispatch(setAlert("Callback request has been canceled", "success"));
    } catch (err) {
        console.log(err.response);
        dispatch({ type: CALLBACK_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }

        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const callbackFailed = (id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/callback/fail/${id}`);

        dispatch({
            type: UPDATE_CALLBACK,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: CALLBACK_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }
        if (err.response.status == 401 || err.response.status == 403) {
            window.location.reload();
        }
        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const clearCallback = () => (dispatch) => {
    dispatch({ type: CLEAR_CALLBACK });
};
