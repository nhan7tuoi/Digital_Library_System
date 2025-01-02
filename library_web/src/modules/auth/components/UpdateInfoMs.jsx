import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Radio,
  notification,
} from "antd";
import { IMAGES } from "../../../constants";
import { getMajors, register, updateUser } from "../api";
import { openNotificationWithIcon } from "../../../helper";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios/axiosConfig";

const { Option } = Select;

const UpdateInfoMs = () => {
  const [listMajors, setListMajors] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const location = useLocation();
  const { user, accessToken, name } = location.state;
  console.log(accessToken);

  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getMajors();
      setListMajors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    if (!validateInput(values)) {
      return;
    }
    try {
      const userUpdate = {
        name: name,
        email: user.email,
        gender: values.gender,
        dob: values.dob,
        majors: values.majors,
        code: values.code,
      };
      localStorage.setItem("accessToken", "");
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      const response = await updateUser(userUpdate);
      console.log(accessToken);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("accessToken", accessToken);
      navigate("/home");
    } catch (error) {
      console.log(error);

      openNotificationWithIcon(
        api,
        "Opps có lỗi xảy ra không thể đăng nhập",
        error.response.data.error.message
      );
    }
  };
  const handleBack = () => {
    navigate("/");
  };

  const validateInput = (values) => {
    const codePattern = /^\d{8}$/;
    if (!codePattern.test(values.code)) {
      openNotificationWithIcon(
        api,
        "Đăng ký thất bại!",
        "Mã sinh viên/ giảng viên phải gồm 8 ký tự số"
      );
      return false;
    }
    return true;
  };

  return (
    <>
      {contextHolder}

      <div className="border items-center shadow-2xl rounded-xl p-3 bg-white">
        <div className="flex justify-center mb-4">
          <img src={IMAGES.LOGO} width={180} />
        </div>
        <div className="text-sm">
          <p className="mb-4">
            Xin chào{" "}
            <span className="font-semibold text-base text-blue-600">
              {name}
            </span>
          </p>
          <p className="text-gray-500">Hãy cập nhật thông tin để tiếp tục</p>
        </div>
        <Form
          className="space-y-2 mt-1"
          onFinish={onFinish}
          layout="vertical"
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item
            label="Mã số sinh viên/ giảng viên"
            name="code"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Khoa"
            name="majors"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn!",
              },
            ]}
          >
            <Select>
              {listMajors &&
                listMajors.map((m) => (
                  <Option key={m._id} value={m._id}>
                    {m.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <div className="flex space-x-20">
            <Form.Item
              label="Ngày sinh"
              name="dob"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập!",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name={"gender"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập!",
                },
              ]}
            >
              <Radio.Group>
                <Radio value="Male"> Nam </Radio>
                <Radio value="Female"> Nữ </Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="flex justify-center items-center space-x-2">
            <Button type="primary" onClick={handleBack}>
              Trở về
            </Button>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default UpdateInfoMs;
