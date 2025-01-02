import { Inject, Service } from "typedi";
import { StatisticsService } from "./statistics.service";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";

@Service()
export class StatisticsController {
  constructor(@Inject() private statisticsService: StatisticsService) {}

  getTop10HighestViewsBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.statisticsService.getTop10HighestViewsBooks(
        req.query
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getTop10HighestRatingBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.statisticsService.getTopHighestRatingsBooks(
        req.query
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getNumOfUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.statisticsService.getNumOfNewUser(req.query);
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  statisticsViewsReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.statisticsService.statisticsViewsReviews(
        req.query.fromDate as string,
        req.query.toDate as string,
        req.query.majorsId as string
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  statisticsUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.statisticsService.statisticsUser(
        req.query.fromDate as string,
        req.query.toDate as string,
        req.query.majorsId as string
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
