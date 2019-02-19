import { SET_WHOISIT, SET_MODEL_STATUS } from "./types";

// Log out the user
export const setWhoIsIt = (whoisit, faceInfo) => dispatch => {
  // Set current user as {} which will set isAuthenticated to false
  dispatch({ type: SET_WHOISIT, payload: {whoisit, faceInfo} });
};

export const setModelStatus = (modelStatus) => dispatch => {
  // Set current user as {} which will set isAuthenticated to false
  dispatch({ type: SET_MODEL_STATUS, payload: modelStatus });
};
