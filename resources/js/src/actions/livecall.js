const axios = window.axios;
import { setAlert } from "./alert";
import store from "../store";
import {
    CLEAR_LIVECALL,
    DELETE_LIVECALL,
    LIVECALL_ERROR,
    LIVECALL_LOADING,
    SET_LIVECALL,
    SET_LIVECALLS,
    SET_VIDEOCALL,
    UPDATE_LIVECALL,
    SET_WAITING_COUNT,
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

export const getLivecallsByUrl = (url) => async (dispatch) => {
    try {
        const res = await axios.get(url);

        dispatch({
            type: SET_LIVECALLS,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }

        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const getConnectedLivecalls = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/livecall/filter/get");

        dispatch({
            type: SET_LIVECALLS,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }

        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const requestLivecall =
    (data, onSuccessful, confirm) => async (dispatch) => {
        dispatch({ type: LIVECALL_LOADING });
        try {
            const res = await axios.post("/api/livecall", data);

            window.Echo.channel(`livecall.${res.data.id}`).listen(
                "AgentConnected",
                (e) => {
                    confirm(e);
                }
            );

            dispatch({
                type: SET_LIVECALL,
                payload: res.data,
            });

            onSuccessful();

            dispatch(getWaitingListPosition(res.data.id));
            dispatch(setAlert("You are connected", "success"));
        } catch (err) {
            console.log(err.response);
            dispatch({ type: LIVECALL_ERROR });
            if (err.response.status === 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "error")
                );
            }

            let msg = err.response.data.message || err.response.data;
            dispatch(setAlert(msg, "error"));
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
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }

        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const leaveLivecall = (id) => async (dispatch) => {
    const livecall = store.getState().livecall.livecall;

    if (!livecall.left_at && !livecall.answered_at) {
        try {
            await axios.get(`/api/livecall/leave/${id}`);
        } catch (err) {
            console.log(err.response);
            dispatch({ type: LIVECALL_ERROR });
            if (err.response.status === 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "error")
                );
            }

            let msg = err.response.data.message || err.response.data;
            dispatch(setAlert(msg, "error"));
        }
    }
};

export const answerLivecall = (id, handleLoading) => async (dispatch) => {
    handleLoading();
    try {
        const res = await axios.post(`/api/room`, {
            livecall: `${id}`,
        });
        handleLoading();
        getLivecallById(id);
        console.log(res.data);

        window.open(`/conferencing/${res.data.id}?pwd=${res.data.pwd}`);
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        handleLoading();
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }
        if (err.response.status === 401 || err.response.status === 403) {
            window.location.reload();
        }
        dispatch(setAlert(err.response.data.msg, "error"));
    }
};

export const endLivecall = (id) => async (dispatch) => {
    if (window.confirm("Are you sure you want to end livecall session?")) {
        dispatch({ type: LIVECALL_LOADING });
        try {
            const res = await axios.get(`/api/room/end/${id}`);

            dispatch({ type: LIVECALL_LOADING });
        } catch (err) {
            console.log(err.response);
            dispatch({ type: LIVECALL_ERROR });
            if (err.response.status === 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "error")
                );
            }
            if (err.response.status === 401 || err.response.status === 403) {
                window.location.reload();
            }
            let msg = err.response.data.message || err.response.data;
            dispatch(setAlert(msg, "error"));
        }
    }
};

export const getWaitingListPosition = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`api/livecall/waiting/position/${id}`);

        dispatch({
            type: SET_WAITING_COUNT,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "error")
            );
        }
        let msg = err.response.data.message || err.response.data;
        dispatch(setAlert(msg, "error"));
    }
};

export const updateLivecalls = (data) => (dispatch) => {
    const auth = store.getState().auth;
    const livecall = store.getState().livecall.livecall;

    if (auth.isAuthenticated) {
        dispatch({
            type: UPDATE_LIVECALL,
            payload: data,
        });
    } else if (livecall && livecall.id === data.id) {
        dispatch({
            type: SET_LIVECALL,
            payload: data,
        });
    }
};

export const delLivecall = (id) => async (dispatch) => {
    if (
        window.confirm(
            "Are you sure you want to delete livecall? This can NOT be undone!"
        )
    ) {
        try {
            await axios.delete(`/api/livecall/${id}`);

            dispatch({
                type: DELETE_LIVECALL,
                payload: id,
            });
        } catch (err) {
            console.log(err.response);
            dispatch({ type: LIVECALL_ERROR });
            if (err.response.status === 500) {
                return dispatch(
                    setAlert("Server errror, please try again.", "error")
                );
            }
            if (err.response.status === 401 || err.response.status === 403) {
                window.location.reload();
            }
            let msg = err.response.data.message || err.response.data;
            dispatch(setAlert(msg, "error"));
        }
    }
};

export const setLivecalls = (data) => (dispatch) => {
    dispatch({
        type: SET_LIVECALLS,
        payload: data,
    });
};

export const clearLivecall = () => (dispatch) => {
    dispatch({ type: CLEAR_LIVECALL });
};
