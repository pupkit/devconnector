import { SET_WHOISIT } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  whoIsIt: "Nobody"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_WHOISIT:
      return {
        ...state,
        whoIsIt: action.payload
      };
    default:
      return state;
  }
};
