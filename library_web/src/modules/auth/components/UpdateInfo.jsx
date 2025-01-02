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
import { getMajors, register } from "../api";
import { openNotificationWithIcon } from "../../../helper";

const { Option } = Select;

const UpdateInfo = ({ handleBack, email, setStage }) => {
  const [listMajors, setListMajors] = useState([]);
  const [api, contextHolder] = notification.useNotification();
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
      const user = {
        name: values.name,
        password: values.password,
        repassword: values.comfirmPassword,
        email: email,
        gender: values.gender,
        dob: values.dob,
        majors: values.majors,
        code: values.code,
      };
      const response = await register(user);
      console.log(response.data);

      setStage(4);
    } catch (error) {
      console.log(error);

      openNotificationWithIcon(
        api,
        "Đăng ký thất bại!",
        error.response.data.error.message.matches
      );
    }
  };

  const validateInput = (values) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const namePattern = /^[a-zA-ZÀ-ỹ\s]+$/;
    const codePattern =/^\d{8}$/
    if (!passwordPattern.test(values.password)) {
      openNotificationWithIcon(
        api,
        "Đăng ký thất bại!",
        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
      );
      return false;
    }
    if (values.password != values.comfirmPassword) {
      openNotificationWithIcon(
        api,
        "Đăng ký thất bại!",
        "Nhập lại mật khẩu không đúng! "
      );
      return false;
    }
    if (!namePattern.test(values.name)) {
      openNotificationWithIcon(
        api,
        "Đăng ký thất bại!",
        "Tên không chứa ký tự đặc biệt"
      );
      return false;
    }
    if(!codePattern.test(values.code)){
      openNotificationWithIcon(
        api,
        "Đăng ký thất bại!",
        "Mã sinh viên/ giảng viên phải gồm 8 ký tự số"
      );
      return false;
    }
    return true
  };

  return (
    <>
      {contextHolder}

      <div className="border items-center shadow-2xl rounded-xl p-3 bg-white">
        <div className="flex justify-end">
          <img src={IMAGES.LOGO} width={90} />
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
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="comfirmPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Họ tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã số sinh viên/ giảng viên"
            name="code"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã sinh viên/ giảng viên!",
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
                message: "Vui lòng chọn khoa!",
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
                  message: "Vui lòng chọn ngày sinh!",
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
                  message: "Vui lòng chọn giới tính!",
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

export default UpdateInfo;
