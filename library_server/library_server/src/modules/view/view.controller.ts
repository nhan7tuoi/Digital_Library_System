import { Inject, Service } from "typedi";
import { ViewService } from "./view.service";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";

@Service()
export class ViewController {
  constructor(@Inject() private viewService: ViewService) {}

  updateView = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.viewService.updateView(req.body.bookId)
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
