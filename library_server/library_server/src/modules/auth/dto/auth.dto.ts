import { IsEmail, IsString, Matches } from "class-validator";

export class AuthVerifyEmailDTO {
  @Matches(
    /^[a-zA-Z0-9._%+-]+@student\.iuh\.edu\.vn$|^[a-zA-Z0-9._%+-]+@iuh\.edu\.vn$/,
    {
      message: "Email phải có định dạng @student.iuh.edu.vn hoặc @iuh.edu.vn",
    }
  )
  email: string;
  @IsString()
  verificationCode: string;
}

export class AuthUpdatePassDTO {
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
    }
  )
  password: string;
  email: string;
}
