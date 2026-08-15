// src/store/appStore.js
import { configureStore } from "@reduxjs/toolkit";
import judgeReducer from "./judgeSlice";

const appStore = configureStore({
  reducer: {
    judge: judgeReducer,
  },
});

export default appStore;
