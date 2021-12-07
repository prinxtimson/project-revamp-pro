import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
// import notification from './notification';

export default combineReducers({
    alert,
    auth,
    profile,
});
