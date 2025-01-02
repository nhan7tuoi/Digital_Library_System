// types/express/index.d.ts
import { Request } from "express";
import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      files?:
        | { [fieldname: string]: Express.Multer.File[] }
        | Express.Multer.File[]; // Hỗ trợ cả dạng mảng và đối tượng
    }
  }
}
