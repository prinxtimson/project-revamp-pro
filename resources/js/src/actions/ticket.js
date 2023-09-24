const axios = window.axios;
import { setAlert } from "./alert";
import {
    CLEAR_TICKET,
    DELETE_TICKET,
    TICKET_ERROR,
    TICKET_LOADING,
    SET_TICKET,
    SET_TICKETS,
} from "./types";

export const getTickets = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/tickets");

        dispatch({
            type: SET_TICKETS,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: TICKET_ERROR });
        if (err.response.status === 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }
        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const submitTicket = (data, onSuccessful) => async (dispatch) => {
    dispatch({ type: TICKET_LOADING });
    try {
        const res = await axios.post("/api/tickets", data);

        onSuccessful();
        dispatch({
            type: SET_TICKET,
            payload: res.data,
        });
        dispatch(setAlert("Ticket had been raised successfully", "success"));
    } catch (err) {
        console.log(err.response);
        dispatch({ type: TICKET_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const updateTicket = (id, data, onSuccessful) => async (dispatch) => {
    dispatch({ type: TICKET_LOADING });
    try {
        const res = await axios.put(`/api/tickets/${id}`, data);

        onSuccessful();
        dispatch({
            type: SET_TICKET,
            payload: res.data,
        });
        dispatch(setAlert("Ticket had been updated successfully", "success"));
    } catch (err) {
        console.log(err.response);
        dispatch({ type: TICKET_ERROR });
        if (err.response.status == 500) {
            return dispatch(
                setAlert("Server errror, please try again.", "danger")
            );
        }

        dispatch(setAlert(err.response.data.message, "danger"));
    }
};

export const getTicketById = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/tickets/${id}`);

        dispatch({
            type: SET_TICKET,
            payload: res.data,
        });
    } catch (err) {
        console.log(err.response);
        dispatch({ type: TICKET_ERROR });
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

export const delTicket = (id) => async (dispatch) => {
    if (
        window.confirm(
            "Are you sure you want to delete ticket? This can NOT be undone!"
        )
    ) {
        try {
            await axios.delete(`/api/tickets/${id}`);

            dispatch({
                type: DELETE_TICKET,
                payload: id,
            });
            dispatch(setAlert(res.data.msg, "success"));
        } catch (err) {
            console.log(err.response);
            dispatch({ type: TICKET_ERROR });
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

export const clearTicket = () => (dispatch) => {
    dispatch({ type: CLEAR_TICKET });
};
