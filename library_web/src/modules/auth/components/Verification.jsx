import React, { useEffect, useRef, useState } from "react";
import { Button, Input, message, notification, Space } from "antd";
import { IMAGES } from "../../../constants";
import { useCountdown } from "../../../hooks/useCountdown";
import { sendCode, sendCodeUpdate, verifyCode } from "../api";
import { openNotificationWithIcon } from "../../../helper";
const Verification = ({ handleBack, setStage, email, type }) => {
  const [api, contextHolder] = notification.useNotification();
  const inputsRef = useRef([]);
  const [code, setCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    countStop: 0,
    intervalMs: 1000,
  });
  useEffect(() => {
    if (isLoading) {
      startCountdown();
    } else {
      resetCountdown();
    }
    if (count === 0) {
      setIsLoading(false);
    }
  }, [isLoading, count, startCountdown, resetCountdown]);
  const handleInputChange = (index, e) => {
    const value = e.target.value;
    // Cập nhật giá trị cho ô hiện tại
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    // Nếu nhập ký tự, chuyển sang ô tiếp theo
    if (value.length === 1 && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
    // Nếu xóa ký tự, chuyển về ô trước đó
    else if (value.length === 0 && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  const handleResend = async () => {
    try {
      setIsLoading(true);
      let response;
      if (type == "register") response = await sendCode(email);
      else response = await sendCodeUpdate(email);
      console.log(response);
      
    } catch (error) {
      console.log(error);
      
      openNotificationWithIcon(
        api,
        "Email không hợp lệ",
        error.response.data.error.message
      );
    }
  };
  const handleSubmit = async () => {
    try {
      const verificationCode = checkVerificationCode();
      if (!verificationCode) return;
      const response = await verifyCode(email, verificationCode);
      setStage(3);
    } catch (error) {
      openNotificationWithIcon(
        api,
        "Xác thực thất bại!",
        error.response.data.error.message
      );
    }
  };

  const checkVerificationCode = () => {
    const verificationCode = code.join("");
    if (verificationCode.length < 4) {
      openNotificationWithIcon(
        api,
        "Email không hợp lệ",
        "Vui lòng nhập đầy đủ mã xác thực!"
      );
      return null;
    }
    return verificationCode;
  };
  return (
    <>
      {contextHolder}

      <div className="border flex flex-col justify-center items-center space-y-5 shadow-2xl rounded-xl p-10 bg-white">
        <div>
          <img src={IMAGES.LOGO} width={250} />
        </div>
        <div>
          <Space>
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={index}
                maxLength={1}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleInputChange(index, e)}
                style={{ width: "50px", textAlign: "center" }}
              />
            ))}
            <Button type="link" disabled={isLoading} onClick={handleResend}>
              {isLoading ? count : "Gửi lại"}
            </Button>
          </Space>
        </div>
        <div className="space-x-2">
          <Button type="primary" onClick={handleBack}>
            Trở về
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Xác nhận
          </Button>
        </div>
      </div>
    </>
  );
};

export default Verification;
