// src/axiosInstance.ts
import axios from "axios";
import { Modal } from "antd";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Đặt URL gốc của API
  timeout: 10000, // Thời gian timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor cho request nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token vào headers nếu có
    const token = localStorage.getItem("accessToken");
    console.log(token);
    
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    config.params = { ...config.params };
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm interceptor cho response nếu cần
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Xử lý lỗi như kiểm tra 401 Unauthorized 
    if (error.response && error.response.status === 401 || error.response.status === 403) {
      console.log(error);
      
      Modal.confirm({
        title: "Phiên đăng nhập đã hết hạn",
        content: "Vui lòng đăng nhập lại để tiếp tục.",
        okText: "Đăng nhập",
        cancelText: "Hủy",
        onOk: () => {
          // Chuyển hướng về trang login sau khi nhấn OK
          window.location.href = "/";
        },
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
