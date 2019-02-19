import { SET_WHOISIT } from "./types";

// Log out the user
export const setWhoIsIt = (whoisit, faceInfo) => dispatch => {
  // Set current user as {} which will set isAuthenticated to false
  dispatch({ type: SET_WHOISIT, payload: {whoisit, faceInfo} });
};
