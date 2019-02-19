import { SET_WHOISIT, SET_MODEL_STATUS } from "../actions/types";
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
    case SET_MODEL_STATUS:
      return {
        ...state,
        modelStatus: action.payload
      };
    default:
      return state;
  }
};
