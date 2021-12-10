import {
    CLEAR_LIVECALL,
    DELETE_LIVECALL,
    LIVECALL_ERROR,
    LIVECALL_LOADING,
    SET_LIVECALL,
    SET_LIVECALLS,
} from "../actions/types";

const initialState = {
    loading: true,
    livecalls: null,
    livecall: null,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case LIVECALL_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SET_LIVECALLS:
            return {
                ...state,
                loading: false,
                livecalls: payload,
            };
        case SET_LIVECALL:
            return {
                ...state,
                loading: false,
                livecall: payload,
            };
        case DELETE_LIVECALL:
            let livecalls = state.livecalls.filter((val) => val.id !== payload);
            return {
                ...state,
                loading: false,
                livecalls,
            };
        case CLEAR_LIVECALL:
            return {
                loading: true,
                livecalls: null,
                livecall: null,
            };
        case LIVECALL_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
