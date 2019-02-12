import { GET_ERRORS } from "./types";
import axios from "axios";

// Register user
export const registeruser = userdata => dispatch => {
  axios
    .post("/api/users/register", userdata)
    .then(res => res.data)
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }));
};
