import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import usersReducer from "./users";
import loaderReducer from "./loader";
import listsReducer from "./lists";

export default configureStore({
  reducer: {
    user: userReducer,
    loader: loaderReducer,
    users: usersReducer,
    lists: listsReducer,
  },
});
