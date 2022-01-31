import {
    CLEAR_CALLBACK,
    DELETE_CALLBACK,
    CALLBACK_ERROR,
    CALLBACK_LOADING,
    SET_CALLBACK,
    SET_CALLBACKS,
    UPDATE_CALLBACK,
} from "../actions/types";

const initialState = {
    loading: true,
    callbacks: null,
    callback: null,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case CALLBACK_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SET_CALLBACKS:
            return {
                ...state,
                loading: false,
                callbacks: payload,
            };
        case SET_CALLBACK:
            return {
                ...state,
                loading: false,
                callback: payload,
            };
        case UPDATE_CALLBACK:
            let i = state.callbacks.data.findIndex(
                (item) => item.id === payload.id
            );
            if (i > -1) state.callbacks.data[i] = payload;
            else state.callbacks.data.unshift(payload);
            return {
                ...state,
                loading: false,
                callbacks: { ...state.callbacks },
            };
        case DELETE_CALLBACK:
            let data = state.callbacks.data.filter((val) => val.id !== payload);
            return {
                ...state,
                loading: false,
                callbacks: { ...state.callbacks, data },
            };
        case CLEAR_CALLBACK:
            return {
                loading: true,
                callbacks: null,
                callback: null,
            };
        case CALLBACK_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
