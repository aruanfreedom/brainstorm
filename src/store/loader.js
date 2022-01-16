import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    main: false
  },
  reducers: {
    showMainLoader: (state) => {
      state.main = true;
    },
    hideMainLoader: (state) => {
      state.main = false;
    },
  },
});

export const { showMainLoader, hideMainLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
