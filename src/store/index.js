import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import loaderReducer from "./loader";

export default configureStore({
  reducer: {
    user: userReducer,
    loader: loaderReducer,
  },
});
