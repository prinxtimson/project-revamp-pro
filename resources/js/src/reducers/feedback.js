import {
    CLEAR_FEEDBACK,
    DELETE_FEEDBACK,
    FEEDBACK_ERROR,
    FEEDBACK_LOADING,
    SET_FEEDBACK,
    SET_FEEDBACKS,
} from "../actions/types";

const initialState = {
    loading: true,
    feedbacks: [],
    feedback: null,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case FEEDBACK_LOADING:
            return {
                ...state,
                loading: !state.loading,
            };
        case SET_FEEDBACKS:
            return {
                ...state,
                loading: false,
                feedbacks: payload,
            };
        case SET_FEEDBACK:
            return {
                ...state,
                loading: false,
                feedback: payload,
            };
        case DELETE_FEEDBACK:
            let data = state.feedbacks.data.filter((val) => val.id !== payload);
            return {
                ...state,
                loading: false,
                feedbacks: { ...state.feedbacks, data },
            };
        case CLEAR_FEEDBACK:
            return {
                loading: true,
                feedbacks: [],
                feedback: null,
            };
        case FEEDBACK_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
