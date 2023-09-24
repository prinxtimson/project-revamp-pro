import {
    CLEAR_TICKET,
    DELETE_TICKET,
    TICKET_ERROR,
    TICKET_LOADING,
    SET_TICKET,
    SET_TICKETS,
} from "../actions/types";

const initialState = {
    loading: false,
    tickets: null,
    ticket: null,
    message: "",
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case TICKET_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SET_TICKETS:
            return {
                ...state,
                loading: false,
                tickets: payload,
            };
        case SET_TICKET:
            return {
                ...state,
                loading: false,
                ticket: payload.data,
                message: payload.msg,
            };
        case DELETE_TICKET:
            let data = state.tickets.data.filter((val) => val.id !== payload);
            return {
                ...state,
                loading: false,
                tickets: { ...state.tickets, data },
            };
        case CLEAR_TICKET:
            return {
                loading: false,
                tickets: null,
                ticket: null,
                message: "",
            };
        case TICKET_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
