import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
    GET_PROFILES,
    PROFILE_LOADING,
    DELETE_PROFILE,
} from "../actions/types";

const initialState = {
    profile: null,
    profiles: [],
    loading: true,
    error: {},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, actions) => {
    const { type, payload } = actions;

    switch (type) {
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true,
            };
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false,
            };
        case UPDATE_PROFILE:
            let index = state.profiles.findIndex(
                (item) => item.id === payload.id
            );
            state.profiles.splice(index, 1, payload);
            return {
                ...state,
                loading: false,
                profiles: [...state.profiles],
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false,
            };
        case DELETE_PROFILE:
            let profiles = state.profiles.filter((item) => item.id !== payload);
            return {
                ...state,
                loading: false,
                profiles,
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case CLEAR_PROFILE:
            return {
                profile: null,
                profiles: [],
                loading: true,
                error: {},
            };
        default:
            return state;
    }
};
