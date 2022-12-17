import { combineReducers } from "redux";
import userReducer from "./users";
import enumReducer from "./enums";
import formsReducer from "./forms";

export default combineReducers({
  user: userReducer,
  enums: enumReducer,
  forms: formsReducer,
});