import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="h-svh w-full flex justify-center items-center bg-img">
      <div className="w-1/3">
        <Outlet/>
      </div>
    </div>
  );
};

export default AuthLayout;
