import React from "react";
import { Button, Form, Input, Flex, notification } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { IMAGES } from "../../../constants";
import { sendCode, sendCodeUpdate } from "../api";
import { openNotificationWithIcon } from "../../../helper";
const SendEmail = ({ setStage, setEmail, email, type }) => {
  const [api, contextHolder] = notification.useNotification();
  const onFinish = async (values) => {
    if (!validateInput(values)) return;
    try {
      let response;
      if (type == "register") response = await sendCode(values.email);
      else response = await sendCodeUpdate(values.email);
      setEmail(response.data);
      setStage(2);
    } catch (error) {
      openNotificationWithIcon(
        api,
        "Email không hợp lệ",
        error.response.data.error.message
      );
    }
  };
  const validateInput = (values) => {
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+(@student\.iuh\.edu\.vn|@iuh\.edu\.vn)$/;
    if (!emailPattern.test(values.email)) {
      openNotificationWithIcon(
        api,
        "Email không hợp lệ",
        "Vui lòng sử dụng định dạng @student.iuh.edu.vn hoặc @iuh.edu.vn"
      );
      return false;
    }
    return true;
  };
  return (
    <>
      {contextHolder}

      <div className="p-10">
        <div className="border flex flex-col justify-center items-center space-y-5 shadow-2xl rounded-xl p-10 bg-white">
          <div>
            <img src={IMAGES.LOGO} width={250} />
          </div>
          <Form
            name="sendmail"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            style={{
              maxWidth: 500,
              width: 300,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="email"
                value={email}
              />
            </Form.Item>
            <Form.Item className="mb-3">
              <Button block type="primary" htmlType="submit">
                Gữi mã xác nhận
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SendEmail;
