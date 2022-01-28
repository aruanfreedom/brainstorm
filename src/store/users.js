import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: null,
    loaded: false,
    adminId: "",
  },
  reducers: {
    addUsers: (state, { payload: users }) => {
      state.data = users;
      state.loaded = true;
    },
    clearUsersData: (state) => {
      state.data = "";
      state.loaded = false;
    },
    addAdminId: (state, { payload: id }) => {
      state.adminId = id;
    },
  },
});

export const { addUsers, clearUsersData, addAdminId } = usersSlice.actions;

export default usersSlice.reducer;
