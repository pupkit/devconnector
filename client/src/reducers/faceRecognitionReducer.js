import { SET_WHOISIT } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  whoIsIt: "Nobody",
  faceInfo: {}
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case SET_WHOISIT:
      return {
        ...state,
        whoIsIt: action.payload.whoisit,
        faceInfo: action.payload.faceInfo
      };
    default:
      return state;
  }
};
