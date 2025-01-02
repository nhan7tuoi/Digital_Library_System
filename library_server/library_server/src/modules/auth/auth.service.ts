import { UserRegisterDTO } from "./../user/dto/user.dto";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Errors } from "../../helper/error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./auth.utils";
import {
  convertTime,
  env,
  generateToken,
  hashPassword,
  sendCodeToEmail,
  TimeType,
} from "../../helper";
import { Inject, Service } from "typedi";
import { RedisService } from "../../redis/redis.service";
import {
  UserLoginDTO,
  UserResponseDTO,
  UserVerifyEmailDTO,
} from "../user/dto/user.dto";
import { UserService } from "../user/user.service";
import Verification from "./model/auth.model";
import { VerificationCodeType } from "./types/auth.type";
import { AuthUpdatePassDTO, AuthVerifyEmailDTO } from "./dto/auth.dto";
import mongoose from "mongoose";
import User from "../user/model/user.model";
import { UserStatus } from "../user/types/user.type";

@Service()
export class AuthService {
  constructor(
    @Inject() private redisService: RedisService,
    @Inject() private userService: UserService
  ) {}

  sendVerificationCode = async (email: string) => {
    const attemptsToday = await this.countCodeToday(email);
    if (attemptsToday >= 3) throw Errors.tooManyRequest;

    const verificationCode = crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase();

    await this.deleteVerificationCode(email);
    await this.saveVerificationCode(email, verificationCode);

    sendCodeToEmail(email, verificationCode);
  };

  sendCodeToRegister = async (params: UserVerifyEmailDTO) => {
    const { email } = params;
    const existedUser = await this.userService.getUserByEmail(email);
    if (existedUser) throw Errors.userExists;
    await this.sendVerificationCode(email);
    return email;
  };

  sendCodeToUpdate = async (params: UserVerifyEmailDTO) => {
    const { email } = params;
    const existedUser = await this.userService.checkExistedEmail(email);
    await this.sendVerificationCode(email);
    return email;
  };

  verifyEmail = async (params: AuthVerifyEmailDTO) => {
    const { email, verificationCode } = params;

    const verification = await this.checkVerificationCode(
      email,
      verificationCode
    );
    let userPending = await this.userService.getUserPending(email);
    if (!userPending) {
      const hashpass = await hashPassword(env.TEMP_PASS);
      userPending = new User({
        email: email,
        password: hashpass,
      });
      await userPending.save();
    }
    await this.deleteVerificationCode(verification.email);
    return verification.email;
  };

  register = async (params: UserRegisterDTO) => {
    const { password, repassword, email, dob, gender, code, majors, name } =
      params;
    const existedUser = await this.userService.getUserByEmail(email);
    if (existedUser) throw Errors.userExists;
    if (password != repassword) throw Errors.invalidRepassword;
    const hashpass = await hashPassword(password);
    const userPending = await this.userService.getUserPending(email);
    if (!userPending) throw Errors.userExists;
    const user = await User.findOneAndUpdate(
      { _id: userPending._id },
      {
        password: hashpass,
        dob: dob,
        gender: gender,
        code: code,
        majors: new mongoose.Types.ObjectId(majors),
        name: name,
        status: UserStatus.Active,
      },
      { new: true }
    );
    return user;
  };
  async getVerificationCode(email: string, code: string) {
    return await Verification.findOne({
      email: email,
      code: code,
      status: VerificationCodeType.Active,
    });
  }

  checkVerificationCode = async (email: string, code: string) => {
    const verification = await this.getVerificationCode(email, code);
    if (!verification) throw Errors.invalidCode;
    if (new Date() > verification.expiredAt) throw Errors.expiredCode;
    return verification;
  };

  async deleteVerificationCode(email: string) {
    await Verification.updateMany(
      { email: email },
      { status: VerificationCodeType.Deleted }
    );
  }
  async saveVerificationCode(email: string, code: string) {
    const today = new Date();
    const expiration = today.setMinutes(today.getMinutes() + 1);

    const verification = new Verification({
      email: email,
      code: code,
      expiredAt: expiration,
      createdAt: today.toDateString(),
    });

    await verification.save();
  }
  async countCodeToday(email: string) {
    const today = new Date().toDateString();
    return await Verification.countDocuments({
      email: email,
      createdAt: today,
    });
  }

  login = async (params: UserLoginDTO) => {
    const { email, password } = params;
    console.log(email);

    const existedUser = await this.userService.checkExistedEmail(email);

    const passwordValid = await bcrypt.compare(password, existedUser.password);
    if (!passwordValid) {
      throw Errors.wrongPassword;
    }

    const payload = { id: existedUser._id.toString(), role: existedUser.role };

    const { accessToken, refreshToken } = await generateToken(
      existedUser._id.toString(),
      payload
    );
    return {
      user: UserResponseDTO.transformUser(existedUser),
      accessToken: accessToken,
      refreshToken: refreshToken,
      role: existedUser.role,
    };
  };

  loginWithMicrosoft = async (params: UserLoginDTO) => {
    const { email, password } = params;

    let user = await this.userService.getUSerActive(email);
    if (user) {
      user = await User.findOneAndUpdate(
        { email: email, status: UserStatus.Active },
        { $set: { emailId: password } },
        { new: true }
      );
    } else {
      const hashpass = await hashPassword(password);

      user = await User.findOneAndUpdate(
        { email: email, status: UserStatus.Pending },
        { $set: { password: hashpass, emailId: password } },
        { new: true, upsert: true }
      );
    }

    const payload = {
      id: user._id.toString(),
      role: user.role,
    };

    const { accessToken, refreshToken } = await generateToken(
      user._id.toString(),
      payload
    );
    // user mới có status là pending FE check status để chuyển trang vào home hoặc vào update
    return {
      user: UserResponseDTO.transformUser(user),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  };

  loginTemp = async (params: UserLoginDTO) => {
    const { email, password } = params;
    console.log(email);

    const existedUser = await this.userService.getUserByEmail(email);
    console.log(existedUser.password);

    if (existedUser.password != password) {
      throw Errors.wrongPassword;
    }
    const payload = { id: existedUser._id.toString(), role: existedUser.role };
    const { accessToken, refreshToken } = await generateToken(
      existedUser._id.toString(),
      payload
    );
    return {
      user: UserResponseDTO.transformUser(existedUser),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  };

  logout = async (params: any) => {
    const { userId, accessToken, refreshToken } = params;
    await this.userService.checkExistedUser(userId);
    await this.redisService.deleteFromhSet(
      `accessToken_${userId}`,
      accessToken
    );
    await this.redisService.deleteFromhSet(
      `refreshToken_${userId}`,
      refreshToken
    );
    return true;
  };

  refreshToken = async (params: any) => {
    const { userId, accessToken, refreshToken } = params;

    const storedRefreshToken = await this.redisService.getValueFromhSet(
      `refreshToken_${userId}`,
      refreshToken
    );
    const decoded = verifyRefreshToken(refreshToken) as {
      id: number;
      role: string;
    };

    if (storedRefreshToken !== refreshToken || !decoded) throw Errors.forbidden;

    const ttlRefreshToken = await this.redisService.getTimeToLiveField(
      `refreshToken_${userId}`,
      refreshToken
    );

    console.log("ttl: ", ttlRefreshToken);
    const payload = { id: decoded.id, role: decoded.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload, ttlRefreshToken[0]);
    await Promise.all([
      this.redisService.deleteFromhSet(`accessToken_${userId}`, accessToken),
      this.redisService.deleteFromhSet(`refreshToken_${userId}`, refreshToken),
      this.redisService.hSet(
        `accessToken_${userId}`,
        newAccessToken,
        newAccessToken,
        convertTime(3, TimeType.m)
      ),
      this.redisService.hSet(
        `refreshToken_${userId}`,
        newRefreshToken,
        newRefreshToken,
        ttlRefreshToken[0]
      ),
    ]);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  };

  updatePassword = async (params: AuthUpdatePassDTO) => {
    const { email, password } = params;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const hashPass = await hashPassword(password);
      const user = await User.findOneAndUpdate(
        { email: email, status: UserStatus.Active },
        { password: hashPass },
        { session, new: true }
      );
      console.log(user._id.toString());
      await this.redisService.deleteAllKeyByUserId(user._id.toString());
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };
}
