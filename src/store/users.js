import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: null,
    loaded: false
  },
  reducers: {
    addUsers: (state, { payload: users }) => {
      state.data = users;
      state.loaded = true;
    },
    clearUsersData: (state) => {
      state.data = "";
      state.loaded = false;
    }
  },
});

export const { addUsers, clearUsersData } = usersSlice.actions;

export default usersSlice.reducer;
