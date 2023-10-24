import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/auth/authSlice";
import callback from "./features/callback/callbackSlice";
import feedback from "./features/feedback/feedbackSlice";
import livecall from "./features/livecall/livecallSlice";
import notification from "./features/notification/notificationSlice";
import profile from "./features/profile/profileSlice";
import ticket from "./features/ticket/ticketSlice";

// import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import thunk from 'redux-thunk';
// import rootReducer from './reducers';

// // create initial state
// const initialState = {};

// // set redux middleware
// const middleware = [thunk];

// // create store
// const storeOld = createStore(
// 	rootReducer,
// 	initialState,
// 	composeWithDevTools(applyMiddleware(...middleware))
// );

export const store = configureStore({
    reducer: {
        auth,
        callback,
        feedback,
        livecall,
        notification,
        profile,
        ticket,
    },
});
