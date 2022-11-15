import { combineReducers } from "redux";
import userReducer from "./users";
import enumReducer from "./enums";

export default combineReducers({
  user: userReducer,
  enums: enumReducer
});