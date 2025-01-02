import { Router } from "express";
import Container from "typedi";
import { StatisticsController } from "./statistics.controller";
import { Role } from "../user/types/user.type";
import { AuthMiddleware } from "../auth/auth.middleware";

const statisticsRouter = Router();
const statisticsController = Container.get(StatisticsController);
const authMiddleware = Container.get(AuthMiddleware)
statisticsRouter.get(
  "/get-highest-views-books",
  authMiddleware.authenticateAccessToken([Role.Admin]),
  statisticsController.getTop10HighestViewsBooks
);
statisticsRouter.get(
  "/get-highest-rating-books",
  authMiddleware.authenticateAccessToken([Role.Admin]),
  statisticsController.getTop10HighestRatingBooks
);
statisticsRouter.get(
  "/get-num-users",
  authMiddleware.authenticateAccessToken([Role.Admin]),
  statisticsController.getNumOfUser
);

statisticsRouter.get(
  "/get-statistics-dashboard",
  authMiddleware.authenticateAccessToken([Role.Admin]),
  statisticsController.statisticsViewsReviews
);

statisticsRouter.get(
  "/get-statistics-user",
  authMiddleware.authenticateAccessToken([Role.Admin]),
  statisticsController.statisticsUser
);

export default statisticsRouter;
