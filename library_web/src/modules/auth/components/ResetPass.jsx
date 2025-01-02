import { Button, Form, Input, notification } from "antd";
import React from "react";
import { IMAGES } from "../../../constants";
import { updatePassword } from "../api";
import { openNotificationWithIcon } from "../../../helper";

const ResetPass = ({ handleBack, setStage, email }) => {
  const [api, contextHolder] = notification.useNotification();
  const onFinish = async (values) => {
    if (!validateInput(values)) {
      return;
    }
    try {
      const response = await updatePassword(email, values.password);
      setStage(4);
    } catch (error) {
      console.log(error);
    }
  };
  const validateInput = (values) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(values.password)) {
      openNotificationWithIcon(
        api,
        "Đổi mật khẩu thất bại!",
        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!"
      );
      return false;
    }
    if (values.conformPassword!==values.password){
        openNotificationWithIcon(
          api,
          "Đổi mật khẩu thất bại!",
          "Nhập lại mật khẩu không chính xác!"
        );
        return false;
    }
    return true;
  };
  return (
    <>
      {contextHolder}
      <div className="border flex flex-col justify-center items-center space-y-5 shadow-2xl rounded-xl p-10 bg-white">
        <div>
          <img src={IMAGES.LOGO} width={250} />
        </div>
        <Form
          className="space-y-2 mt-1 w-full"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Nhập mật khẩu mới"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu"
            name="conformPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <div className="space-x-2 flex mt-4 justify-center">
              <Button type="primary" onClick={handleBack}>
                Trở về
              </Button>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ResetPass;
