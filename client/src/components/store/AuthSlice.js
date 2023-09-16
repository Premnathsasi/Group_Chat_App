import { createSlice } from "@reduxjs/toolkit";

const isLoggedin = !!localStorage.getItem("token");
const initialState = { isAuthenticate: isLoggedin, token: "" };

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, actions) {
      const { token } = actions.payload;
      localStorage.setItem("token", token);
      state.isAuthenticate = true;
      state.token = token;
    },
    logout(state) {
      state.isAuthenticate = false;
      localStorage.removeItem("token");
    },
  },
});

export const authActions = AuthSlice.actions;
export default AuthSlice.reducer;
