import React, { useState } from "react";
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  TreeSelect,
  Segmented,
  Radio,
} from "antd";
import UpdateInfo from "./components/UpdateInfo";
import SendEmail from "./components/SendEmail";
import Verification from "./components/Verification";
import { Link } from "react-router-dom";
const { Option } = Select;

const Register = () => {
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState("");
  console.log(email);

  const handleBack = () => {
    setStage(stage - 1);
  };

  switch (stage) {
    case 1:
      return (
        <>
          <SendEmail
            setStage={setStage}
            setEmail={setEmail}
            email={email}
            type={"register"}
          />
        </>
      );
    case 2:
      return (
        <>
          <Verification
            handleBack={handleBack}
            setStage={setStage}
            setEmail={setEmail}
            email={email}
            type={"register"}
          />
        </>
      );
    case 3:
      return (
        <>
          <UpdateInfo
            handleBack={handleBack}
            email={email}
            setStage={setStage}
          />
        </>
      );
    case 4:
      return (
        <>
          <div className="border flex flex-col justify-center items-center space-y-5 shadow-2xl rounded-xl p-10 bg-white">
            <p>Đăng ký thành công!</p>
            <Link
              to={"/"}
              state={{ email: email }}
              className="font-medium text-blue-500"
            >
              {" "}
              Quay về đăng nhập
            </Link>
          </div>
        </>
      );
  }
};

export default Register;
