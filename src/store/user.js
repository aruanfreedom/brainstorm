import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "user",
  initialState: {
      uid: "",
  },
  reducers: {
    addUser: (state, { payload }) => {
      console.log(payload);
      state.uid = payload;
    },
  },
});

export const { addUser } = counterSlice.actions;

export default counterSlice.reducer;
