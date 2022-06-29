const axios = window.axios;
import { setAlert } from "./alert";
import {
    CLEAR_FEEDBACK,
    DELETE_FEEDBACK,
    FEEDBACK_ERROR,
    FEEDBACK_LOADING,
    SET_FEEDBACK,
    SET_FEEDBACKS,
} from "./types";

export const getFeedbacks = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/feedback");

        dispatch({
            type: SET_FEEDBACKS,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: FEEDBACK_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const submitFeedback = (data, onSuccessful) => async (dispatch) => {
    dispatch({ type: FEEDBACK_LOADING });
    try {
        const res = await axios.post("/api/feedback", data);

        onSuccessful();

        dispatch({ type: FEEDBACK_LOADING });

        dispatch(setAlert(res.data, "success"));
    } catch (err) {
        console.log(err.response);
        dispatch({ type: FEEDBACK_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const getFeedbackById = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/feedback/${id}`);

        dispatch({
            type: SET_FEEDBACK,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: FEEDBACK_ERROR });
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

export const delFeedback = (id) => async (dispatch) => {
    if (
        window.confirm(
            "Are you sure you want to delete feedback? This can NOT be undone!"
        )
    ) {
        try {
            await axios.delete(`/api/feedback/${id}`);

            dispatch({
                type: DELETE_FEEDBACK,
                payload: id,
            });
        } catch (err) {
            console.log(err.response);
            dispatch({ type: FEEDBACK_ERROR });
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

export const clearFeedback = () => (dispatch) => {
    dispatch({ type: CLEAR_FEEDBACK });
};
