import React from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { setUserData } from "../redux/slices/userSlice";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  dispatch(setUserData(JSON.parse(localStorage.getItem("user"))));
  const isAuthenticated = !!localStorage.getItem("accessToken"); // Kiểm tra token

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
