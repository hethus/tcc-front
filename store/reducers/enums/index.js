import { HYDRATE } from "next-redux-wrapper";
import { ENUM_UPDATE, ENUM_RESET } from "../../actions";

const initialState = null;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.enums };
    case ENUM_UPDATE:
      const newState = { ...state, ...action.payload };
      return newState;
    case ENUM_RESET:
      return initialState;
    default:
      return state;
  }
};

export default reducer;