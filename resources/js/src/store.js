import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/auth/authSlice";
import callback from "./features/callback/callbackSlice";
import feedback from "./features/feedback/feedbackSlice";
import livecall from "./features/livecall/livecallSlice";
import notification from "./features/notification/notificationSlice";
import profile from "./features/profile/profileSlice";
import ticket from "./features/ticket/ticketSlice";
import setting from "./features/setting/settingSlice";
import performance from "./features/performance/performanceSlice";
import report from "./features/report/reportSlice";
import activity from "./features/activity/activitySlice";
import chat from "./features/chat/chatSlice";
import tutorial from "./features/tutorial/tutorialSlice";

export const store = configureStore({
    reducer: {
        auth,
        callback,
        feedback,
        livecall,
        notification,
        profile,
        ticket,
        setting,
        performance,
        report,
        activity,
        chat,
        tutorial,
    },
});
