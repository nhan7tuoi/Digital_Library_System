import { createSlice } from "@reduxjs/toolkit";

export const bookSlice = createSlice({
  name: "book",
  initialState: {
    page: 0,
  },
  reducers: {
    setPageData: (state, action) => {
      state.page = action.payload;
    },
  },
});
export const { setPageData } = bookSlice.actions;

export default bookSlice.reducer;