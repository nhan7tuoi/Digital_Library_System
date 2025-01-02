import React, { useEffect, useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import {
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  notification,
  Select,
  message,
  Radio,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MdOutlineArrowBack } from "react-icons/md";
import { getMajors, updateAvatar, updateUser } from "../modules/auth/api";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";
import { openNotificationWithIcon } from "../helper";
const { Option } = Select;
const UserProfileSidebar = ({
  user,
  isOpen,
  onClose,
  logout,
  changePassword,
}) => {
  const [nuser, setUser] = useState(user);
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [listMajors, setListMajors] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(user);

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
  const handleFormSubmit = async (values) => {
    if (!validateInput(values)) {
      return;
    }
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("code", values.code);
    formData.append("dob", values.dob);
    formData.append("majors", values.majors);
    formData.append("gender", values.gender);

    try {
      console.log(formData);

      const response = await updateUser(formData);
      if (file) {
        formData.append("image", file); // Thêm file vào formData
        const response2 = await updateAvatar(formData);
      }

      console.log("Response from server:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(setUserData(JSON.parse(localStorage.getItem("user"))));
      message.success("Đã cập nhập người dùng!");
      setIsEditing(!isEditing);
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Đã xảy ra lỗi khi gửi thông tin!");
    }
  };

  const handleImageUpload = (file) => {
    const imageUrl = URL.createObjectURL(file); // Hiển thị trước ảnh
    console.log(imageUrl);

    setUser({ ...nuser, image: imageUrl });
    setFile(file); // Lưu file ảnh vào state
    return false; // Ngăn không upload mặc định của Upload
  };

  const handClose = () => {
    setIsEditing(false);
    onClose();
  };
  const validateInput = (values) => {
    const namePattern = /^[a-zA-ZÀ-ỹ\s]+$/;
    const codePattern = /^\d{8}$/;
    if (!namePattern.test(values.name)) {
      openNotificationWithIcon(
        api,
        "Đăng ký thất bại!",
        "Tên không chứ ký tự đặc biệt"
      );
      return false;
    }
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
      <div
        className={`fixed top-0 right-0 h-full max-h-screen w-3/12 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
      >
        <Button
          className="absolute top-4 right-4 text-xl text-gray-500"
          onClick={() => handClose()}
        >
          <RiCloseLargeFill />
        </Button>

        {isEditing && (
          <Button
            className="absolute top-4 left-4 text-xl text-gray-500"
            onClick={() => {
              setIsEditing(!isEditing);
            }}
          >
            <MdOutlineArrowBack />
          </Button>
        )}
        <div className="p-6 text-black mt-10 w-full overflow-hidden">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: nuser.name,
              email: nuser.email,
              code: nuser.code,
              majors: nuser.majors._id,
              dob: moment(nuser.dob),
              gender: nuser.gender,
            }}
            onFinish={handleFormSubmit}
            className="space-y-4"
          >
            {/* Avatar Upload */}
            <Form.Item>
              <div className="flex flex-col items-center">
                <Avatar size={100} src={nuser.image} className="mb-2" />
                {isEditing && (
                  <Upload
                    beforeUpload={handleImageUpload}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                )}
              </div>
            </Form.Item>

            {/* Name */}
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn!" },
              ]}
            >
              <Input
                placeholder="Nhập tên"
                disabled={!isEditing}
                style={{ color: !isEditing ? "black" : "inherit" }}
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                placeholder="Nhập email"
                disabled={!isEditing}
                style={{ color: !isEditing ? "black" : "inherit" }}
              />
            </Form.Item>
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
              <Input
                disabled={!isEditing}
                style={{ color: !isEditing ? "black" : "inherit" }}
              />
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
              <Select disabled={!isEditing}>
                {listMajors &&
                  listMajors.map((m) => (
                    <Option key={m._id} value={m._id}>
                      {m.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
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
              <DatePicker
                disabled={!isEditing}
                style={{ color: !isEditing ? "black" : "inherit" }}
              />
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
              <Radio.Group disabled={!isEditing}>
                <Radio
                  value="Male"
                  style={{ color: !isEditing ? "black" : "inherit" }}
                >
                  {" "}
                  Nam{" "}
                </Radio>
                <Radio
                  value="Female"
                  style={{ color: !isEditing ? "black" : "inherit" }}
                >
                  {" "}
                  Nữ{" "}
                </Radio>
              </Radio.Group>
            </Form.Item>
            {/* Action Buttons */}
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  if (isEditing) {
                    form.submit();
                  } else {
                    setIsEditing(!isEditing);
                  }
                }}
                block
              >
                {isEditing ? "Lưu" : "Chỉnh sửa thông tin"}
              </Button>
            </Form.Item>
          </Form>
          {!isEditing && (
            <div className="w-full space-y-2 mt-2">
              <Button
                type="primary"
                className=" w-full"
                onClick={changePassword}
              >
                Đổi mật khẩu
              </Button>
              <Button type="primary" className=" w-full" onClick={logout}>
                Đăng xuất
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfileSidebar;
