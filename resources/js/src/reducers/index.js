import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import callback from "./callback";
import livecall from "./livecall";
import feedback from "./feedback";
// import notification from './notification';

export default combineReducers({
    alert,
    auth,
    profile,
    callback,
    livecall,
    feedback,
});
