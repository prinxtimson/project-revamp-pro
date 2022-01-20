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
    UPDATE_LIVECALL_ADMIN,
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
                setAlert("Server errror, please try again.", "danger")
            );
        }
        // if (err.response.status === 401 || err.response.status === 403) {
        //     window.location.reload();
        // }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const getConnectedLivecalls = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/livecall/on");

        dispatch({
            type: SET_LIVECALLS,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const requestLivecall =
    (data, onLivecallRequest, showSurveyForm) => async (dispatch) => {
        dispatch({ type: LIVECALL_LOADING });
        try {
            const res = await axios.post("/api/livecall", data);

            window.Echo.channel(`livecall.${res.data.id}`).listen(
                "AgentConnected",
                (e) => {
                    console.log(e);
                    if (
                        window.confirm("You will now be transfer to an agent.")
                    ) {
                        showSurveyForm();
                        window.open(
                            `/confrencing/${e.data.id}?pwd=${e.password}`
                        );
                    }
                }
            );

            dispatch({
                type: SET_LIVECALL,
                payload: res.data,
            });

            onLivecallRequest();

            dispatch(getConnectedLivecalls());
            dispatch(setAlert("You are connected", "success"));
        } catch (err) {
            console.log(err.response);
            dispatch({ type: LIVECALL_ERROR });
            if (err.response.status === 500) {
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
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
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
                    setAlert("Server errror, please try again.", "danger")
                );
            }

            dispatch(setAlert(err.response.data.message, "danger"));
        }
    }
};

export const answerLivecall = (id) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const res = await axios.post(
            `/api/room`,
            {
                livecall: `${id}`,
                roomName: `call_${id}`,
            },
            config
        );
        console.log(res.data);
        window.open(`/confrencing/${res.data.id}?pwd=${res.data.pwd}`);
    } catch (err) {
        console.log(err.response);
        dispatch({ type: LIVECALL_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }
        if (err.response.status === 401 || err.response.status === 403) {
            window.location.reload();
        }
        dispatch(setAlert(err.response.data.msg, "danger"));
    }
};

export const updateLivecalls = (data) => (dispatch) => {
    const auth = store.getState().auth;
    const livecall = store.getState().livecall.livecall;

    if (auth.isAuthenticated) {
        dispatch({
            type: UPDATE_LIVECALL_ADMIN,
            payload: data,
        });
    } else {
        if (livecall && livecall.id === data.id) {
            dispatch({
                type: SET_LIVECALL,
                payload: data,
            });
        } else {
            dispatch({
                type: UPDATE_LIVECALL,
                payload: data,
            });
        }
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

export const setLivecalls = (data) => (dispatch) => {
    dispatch({
        type: SET_LIVECALLS,
        payload: data,
    });
};

export const clearLivecall = () => (dispatch) => {
    dispatch({ type: CLEAR_LIVECALL });
};
