import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    uid: "",
    role: "",
    settings: {},
  },
  reducers: {
    addUser: (state, { payload: uid }) => {
      state.uid = uid;
    },
    addMember: (state) => {
      state.role = "member";
    },
    addSettings: (state, { payload: settings }) => {
      state.settings = settings;
      state.role = "admin";
    },
  },
});

export const { addUser, addSettings, addMember } = userSlice.actions;

export default userSlice.reducer;
