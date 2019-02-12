import { TEST_DISPATCH } from "./types";

// Register user
export const registeruser = userdata => {
  return {
    type: TEST_DISPATCH,
    payload: userdata
  };
};
