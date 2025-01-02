import { Router } from "express";
import Container from "typedi";
import { ReviewController } from "./review.controller";
import { Role } from "../user/types/user.type";
import { AuthMiddleware } from "../auth/auth.middleware";
import { ReviewMiddleware } from "./review.middleware";
import { ReviewCreateReqDTO } from "./dto/review.dto";

const reviewRouter = Router();
const reviewController = Container.get(ReviewController);
const authMiddleware = Container.get(AuthMiddleware);
const reviewMiddleware = new ReviewMiddleware()
reviewRouter.post(
  "/review",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  reviewMiddleware.validateReview(ReviewCreateReqDTO),
  reviewController._createReview
);
//query: bookId
reviewRouter.get(
  "/reviews",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  reviewController._getReviewByBookId
);
//query: bookId
reviewRouter.get(
  "/review-newest",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  reviewController._getReviewNewestByBookId
);

export default reviewRouter;
