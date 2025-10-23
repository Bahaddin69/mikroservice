import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  cart: null,
  order: null,
  payment: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setPayment: (state, action) => {
      state.payment = action.payload;
    },
  },
});

export const { login, logout, setCart, setOrder, setPayment } =
  authSlice.actions;
export default authSlice.reducer;
