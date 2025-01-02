import * as dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
export const env = process.env;

import { RedisService } from "../redis/redis.service";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../modules/auth/auth.utils";
import { Queues } from "./queue";
import OpenAI from "openai";

const redisService = new RedisService();

export enum TimeType {
  s = "second",
  m = "minute",
  h = "hour",
  d = "day",
}

export const convertTime = (num: number, unit: string) => {
  switch (unit) {
    case TimeType.s:
      return num;
    case TimeType.m:
      return num * 60;
    case TimeType.h:
      return num * 3600;
    case TimeType.d:
      return num * 86400;
  }
};

export const generateToken = async (id: string, payload: any) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(
    payload,
    convertTime(14, TimeType.d)
  );

  //Lưu vào hset
  await redisService.hSet(
    `accessToken_${id}`,
    accessToken,
    accessToken,
    convertTime(7, TimeType.d)
  );
  await redisService.hSet(
    `refreshToken_${id}`,
    refreshToken,
    refreshToken,
    convertTime(14, TimeType.d)
  );
  return { accessToken, refreshToken };
};

export const sendCodeToEmail = (email: string, code: string) => {
  Queues.emailQueue.addJob({
    email: email,
    subject: "Verification code",
    content: code,
  });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
