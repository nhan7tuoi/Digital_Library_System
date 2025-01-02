import { Inject, Service } from "typedi";
import { MajorsService } from "./majors.service";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";

@Service()
export class MajorsConatroller {
  constructor(@Inject() private majorsService: MajorsService) {}

  _getListMajors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.majorsService.getListMajors();
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  _createMajors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.majorsService.createMajors(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };
}
