import {
    ACCOUNT_DELETED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_USER,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_LOADING,
    SET_USERS,
    ON_NEW_NOTIFICATION,
    ON_READ_NOTIFICATION,
} from "../actions/types";

const initialState = {
    isAuthenticated: null,
    loading: true,
    user: null,
    notifications: null,
    users: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case AUTH_LOADING:
            return {
                ...state,
                loading: !state.loading,
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case LOGOUT_USER:
        case ACCOUNT_DELETED:
            return {
                ...state,
                token: null,
                isAuthenticated: null,
                loading: false,
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                ...payload,
            };
        case ON_NEW_NOTIFICATION:
            let data = [payload, ...state.notifications.data];
            let count = state.notifications.count + 1;
            return { ...state, notifications: { data, count } };
        case ON_READ_NOTIFICATION:
            return { ...state, notifications: payload };
        case SET_USERS:
            return {
                ...state,
                loading: false,
                users: payload,
            };
        default:
            return state;
    }
};
