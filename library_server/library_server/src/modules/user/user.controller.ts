import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";
import { Pagination } from "../../helper/pagination";
import { saveFile } from "../../aws/aws.helper";

@Service()
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  _banUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.banUser(req.body.bannedUserId);
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  _findUserByKeyword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { users, pagination } = await this.userService.findUserByKeyword(
        req.body.keyword,
        Pagination.fromRequestBody(req)
      );
      res.send(new ResponseCustom(users, null, pagination));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  _postFcmtoken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.postFcmToken(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  _getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getMe(req.body.userId);
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  _updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.updateUser(req.body);
      
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  _getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getAllUsers();
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  _updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imgFile = req.file;
      const image = await saveFile(imgFile);
      req.body.image = image;
      const result = await this.userService.updateAvatar(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
