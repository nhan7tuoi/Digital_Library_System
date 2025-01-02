import React, { useEffect, useState } from "react";
import { IMAGES } from "../constants";
import { IoHome } from "react-icons/io5";
import { SlBookOpen } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";

import { Button, Dropdown, Image, Input, Space } from "antd";
import { useSelector } from "react-redux";
import UserProfileSidebar from "./UserProfileSidebar";
const { Search } = Input;

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const onSearch = (value, _e, info) => {
    if (value) navigate("/result", { state: { value } });
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleChangePass = () => {
    navigate("/update-password");
  };
  const handleAvatarClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const items = [
    {
      key: "1",
      label: (
        <Button type="link" className="text-black">
          Chỉnh sửa thông tin
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="link" className="text-black" onClick={handleChangePass}>
          Đổi mật khẩu
        </Button>
      ),
    },
    {
      key: "3",
      label: (
        <Button type="link" className="text-black" onClick={handleLogout}>
          Đăng xuất
        </Button>
      ),
    },
  ];
  return (
    <div className="grid grid-cols-10 bg-blue-950 px-5 py-1 text-white gap-2">
      <div className="col-span-5 flex items-center space-x-2 text-lg">
        <div className="bg-white rounded-lg">
          <img src={IMAGES.LOGO} width={100} />
        </div>
        <Link
          to={"/home"}
          className="flex space-x-2 items-center hover:bg-slate-500 py-2 px-5 rounded-md"
        >
          <span>{IoHome()}</span>
          <span>Trang chủ</span>
        </Link>
        <Link
          to={"/genre"}
          className="flex space-x-2 items-center hover:bg-slate-500 py-2 px-5 rounded-md"
        >
          <span>{SlBookOpen()}</span>
          <span>Thể loại</span>
        </Link>
      </div>

      <div className="col-span-3 items-center flex">
        <Search
          placeholder="Tìm kiếm"
          allowClear
          onSearch={onSearch}
          size="large"
          enterButton
        />
      </div>
      <div className="col-span-2 flex items-center justify-end space-x-4">
        <div className="overflow-hidden">
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.name}
          </p>
        </div>
        <div>
          <div className="relative">
            {/* Avatar */}
            <img
              src={user.image}
              alt="Avatar"
              className="w-12 h-12 rounded-full cursor-pointer"
              onClick={handleAvatarClick}
            />
            {/* Sidebar */}
            <UserProfileSidebar
              user={user}
              isOpen={isSidebarOpen}
              onClose={handleCloseSidebar}
              logout = {handleLogout}
              changePassword = {handleChangePass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
