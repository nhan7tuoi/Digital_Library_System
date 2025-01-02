import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { handleErrorsMiddleware } from "../../helper/error";

export class HistoryMiddleware {
  validate<T extends object>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const DTO = plainToClass(dtoClass, req.body);
        const errors = await validate(DTO);
        if (errors.length > 0) return handleErrorsMiddleware(errors, res);
        req.body = DTO;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}