import React, { useEffect } from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn về đầu trang khi location thay đổi
  }, [location]);
  return (
    <div className="h-screen overflow-auto scrollbar-hide">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <div className="bg-slate-200">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
