import { createSlice } from "@reduxjs/toolkit";

export const listsSlice = createSlice({
  name: "lists",
  initialState: {
    sheets: {},
  },
  reducers: {
    addSheets: (state, { payload: sheets }) => {
      state.sheets = sheets;
    },
    addSheetNumber: (state, { payload: sheetNumber }) => {
      state.sheets.sheetNumber = sheetNumber;
    },
  },
});

export const { addSheets, addSheetNumber } = listsSlice.actions;

export default listsSlice.reducer;
