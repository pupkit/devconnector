import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import faceRecognitionReducer from "./faceRecognitionReducer";

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  faceRecognition: faceRecognitionReducer
});
