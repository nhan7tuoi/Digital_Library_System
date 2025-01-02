import { Inject, Service } from "typedi";
import { HistoryService } from "./history.service";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";

@Service()
export class HistoryController {
  constructor(@Inject() private historyService: HistoryService) {}

  createHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.historyService.createHistory(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  getHistoriesByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.historyService.getHistoriesByUserId(
        req.body.userId
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  getOneHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.historyService.getOneHistory(
        req.body.userId,
        req.query.bookId as string
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };


  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.historyService.getHistory(
         req.body.userId,
        req.params.bookId
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  deleteHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.historyService.deleteHistory(
        req.params.historyId
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };
}
