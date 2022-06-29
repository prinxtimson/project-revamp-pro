import {
    CLEAR_LIVECALL,
    DELETE_LIVECALL,
    LIVECALL_ERROR,
    LIVECALL_LOADING,
    SET_LIVECALL,
    SET_LIVECALLS,
    SET_WAITING_COUNT,
    UPDATE_LIVECALL,
} from "../actions/types";

const initialState = {
    loading: true,
    livecalls: null,
    livecall: null,
    count: 0,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case LIVECALL_LOADING:
            return {
                ...state,
                loading: !state.loading,
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
        case UPDATE_LIVECALL:
            let i = state.livecalls.data.findIndex(
                (item) => item.id === payload.id
            );
            if (i > -1) state.livecalls.data[i] = payload;
            else state.livecalls.data.unshift(payload);
            return {
                ...state,
                loading: false,
                livecalls: { ...state.livecalls },
                livecall: payload,
            };
        case SET_WAITING_COUNT:
            return {
                ...state,
                loading: false,
                count: payload,
            };
        case DELETE_LIVECALL:
            let data = state.livecalls.data.filter((val) => val.id !== payload);
            return {
                ...state,
                loading: false,
                livecalls: { ...state.livecalls, data },
            };
        case CLEAR_LIVECALL:
            return {
                loading: true,
                livecalls: null,
                livecall: null,
                count: 0,
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
