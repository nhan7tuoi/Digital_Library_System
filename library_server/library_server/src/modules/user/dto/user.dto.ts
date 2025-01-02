import { Expose, plainToInstance, Transform } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  matches,
} from "class-validator";

export class UserRegisterDTO {
  @IsString()
  name: string;
  @IsString()
  gender: string;
  @IsString()
  dob: Date;
  @Matches(
    /^[a-zA-Z0-9._%+-]+@student\.iuh\.edu\.vn$|^[a-zA-Z0-9._%+-]+@iuh\.edu\.vn$/,
    {
      message: "Email phải có định dạng @student.iuh.edu.vn hoặc @iuh.edu.vn",
    }
  )
  email: string;
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
    }
  )
  password: string;
  @IsString()
  repassword: String;
  @IsString()
  majors: string;
  @IsString()
  code: string;
}

export class UserUpdateDTO {
  userId: string;
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  gender: string;
  @IsOptional()
  @IsString()
  dob: Date;
  @IsOptional()
  @IsString()
  majors: string;
  @IsOptional()
  @IsString()
  code: string;
}

export class UserVerifyEmailDTO {
  @Matches(
    /^[a-zA-Z0-9._%+-]+@student\.iuh\.edu\.vn$|^[a-zA-Z0-9._%+-]+@iuh\.edu\.vn$/,
    {
      message: "Email phải có định dạng @student.iuh.edu.vn hoặc @iuh.edu.vn",
    }
  )
  email: string;
}

export class UserResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  name: string;
  @Expose()
  gender: string;
  @Expose()
  email: string;
  @Expose()
  @Transform(({ obj }) => obj.dob?.toString())
  dob: string;
  @Expose()
  status: string;
  @Expose()
  code: string;
  @Expose()
  @Transform(({ obj }) =>
    obj.majors
      ? { _id: obj.majors._id.toString(), name: obj.majors.name }
      : null
  )
  majors: { _id: string; name: string } | null;
  @Expose()
  image: string;
  static transformUser(params: any | any[]) {
    return plainToInstance(UserResponseDTO, params, {
      excludeExtraneousValues: true,
    });
  }
}

export class UserLoginDTO {
  email: string;
  @IsString()
  password: string;
}
