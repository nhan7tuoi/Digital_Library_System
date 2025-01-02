import React, { useState } from "react";
import SendEmail from "./components/SendEmail";
import Verification from "./components/Verification";
import ResetPass from "./components/ResetPass";
import { Link } from "react-router-dom";


const ForgetPass = () => {
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState("");


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
            type={"update"}
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
            type={"update"}
          />
        </>
      );
    case 3:
      return (
        <>
          <ResetPass
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
            <p>Mật khẩu đã được thay đổi!</p>
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

export default ForgetPass;
