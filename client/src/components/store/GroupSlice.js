import { createSlice } from "@reduxjs/toolkit";

const GroupSlice = createSlice({
  name: "groups",
  initialState: {},
  reducers: {
    addGroup(state, actions) {
      localStorage.removeItem("messages");
      return { ...actions.payload };
    },
  },
});

export const groupActions = GroupSlice.actions;

export default GroupSlice.reducer;
