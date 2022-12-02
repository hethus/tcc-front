import { HYDRATE } from "next-redux-wrapper";
import { FORMS_UPDATE, FORMS_RESET } from "../../actions";

const initialState = [];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...action.payload };
    case FORMS_UPDATE:
      const newState = { ...state, ...action.payload };
      return newState;
    case FORMS_RESET:
      return initialState;
    default:
      return state;
  }
};

export default reducer;