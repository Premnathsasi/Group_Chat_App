import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import groupReducer from "./GroupSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupReducer,
  },
});

export default store;
