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
                setAlert("Server errror, please try again.", "danger")
            );
        }
        // if (err.response.status === 401 || err.response.status === 403) {
        //     window.location.reload();
        // }
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const requestCallback = (id, data, onSuccessful) => async (dispatch) => {
    dispatch({ type: CALLBACK_LOADING });
    try {
        const res = await axios.post("/api/callback", data);

        onSuccessful();

        dispatch(setAlert("Callback request received", "success"));

        dispatch(leaveLivecall(id));

        dispatch({
            type: SET_CALLBACK,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: CALLBACK_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
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
                setAlert("Server errror, please try again.", "danger")
            );
        }
        if (err.response.status == 401 || err.response.status == 403) {
            window.location.reload();
        }
        dispatch(setAlert(err.response.data.message, "danger"));
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
                    setAlert("Server errror, please try again.", "danger")
                );
            }
            if (err.response.status == 401 || err.response.status == 403) {
                window.location.reload();
            }
            dispatch(setAlert(err.response.data.message, "danger"));
        }
    }
};

export const clearCallback = () => (dispatch) => {
    dispatch({ type: CLEAR_CALLBACK });
};
