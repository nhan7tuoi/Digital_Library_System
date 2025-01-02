import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    data: {},
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    banUser: (state, action) => {
      state.data.data = state.data.data.map((u) =>
        u._id == action.payload.userId
          ? {
              ...u,
              status:
                action.payload.currentStatus === "active" ? "banned" : "active",
            }
          : u
      );
    },
  },
});

export const { setUserData, banUser } = userSlice.actions;

export default userSlice.reducer;

