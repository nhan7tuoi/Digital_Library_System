import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "./response";

export class ErrorCustom extends Error {
  status: number;
  code: string;
  message: string;
  constructor(message: string, code: string, status: number = 400) {
    super();
    this.status = status;
    this.code = code;
    this.message = message;
  }
}
export const Errors = {
  badRequest: new ErrorCustom("Bad request", "badRequest", 400),
  internalServer: new ErrorCustom(
    "Internal Server Error",
    "internalServer",
    500
  ),
  unAuthorized: new ErrorCustom("Unauthorized", "unAuthorized", 401),
  forbidden: new ErrorCustom("Forbidden", "forbidden", 403),
  conflict: new ErrorCustom("Conflict", "conflict", 409),
  notFound: new ErrorCustom("NotFound", "notFound", 404),
  userExists: new ErrorCustom("Người dùng đã tồn tại", "userExists", 409),

  userNotExists: new ErrorCustom(
    "Người dùng không tồn tại",
    "userNotExists",
    400
  ),
  tooManyRequest: new ErrorCustom(
    "Bạn đã đạt giới hạn gữi 3 lần mỗi ngày",
    "tooManyRequest",
    429
  ),
  wrongPassword: new ErrorCustom("Sai mật khẩu", "wrongPassword", 400),
  isNotEmpty: new ErrorCustom("Values should not be empty", "isNotEmpty", 400),
  invalidRepassword: new ErrorCustom(
    "Invalid Repassword",
    "invalidRepassword",
    400
  ),
  invalidCode: new ErrorCustom(
    "Mã xác nhận không chính xác",
    "invalidCode",
    400
  ),
  expiredCode: new ErrorCustom("Mã xác nhận hết hạn", "expiredCode", 410),
  bookNotExits: new ErrorCustom("Sách không tồn tại", "bookNotExits", 400),
  ChapterNotExits: new ErrorCustom(
    "Chương này không tồn tại",
    "ChapterNotExits",
    400
  ),
  noteNotExits: new ErrorCustom(
    "Ghi chú này không tồn tại",
    "noteNotExits",
    400
  ),
};
export const handleErrors = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);
  if (error instanceof ErrorCustom) {
    res
      .status(error.status || Errors.badRequest.status)
      .send(new ResponseCustom(null, error));
  }
  res
    .status(Errors.internalServer.status)
    .send(new ResponseCustom(null, Errors.internalServer));
};

export const handleErrorsMiddleware = (errors: any, res: Response) => {
  if (errors.length > 0) {
    const error = new ErrorCustom(
      errors[0].constraints,
      Errors.badRequest.code,
      Errors.badRequest.status
    );
    res.status(Errors.badRequest.status).send(new ResponseCustom(null, error));
  }
};
