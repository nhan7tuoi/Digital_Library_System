import { Inject, Service } from "typedi";
import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./review.service";
import { ResponseCustom } from "../../helper/response";

@Service()
export class ReviewController {
  constructor(@Inject() private reviewService: ReviewService) {}

  _createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reviewService.createReview(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  _getReviewByBookId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.reviewService.getReviewByBookId(
        req.query.bookId as string
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  _getReviewNewestByBookId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.reviewService.getReviewNewestByBookId(
        req.query.bookId as string
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };


}
