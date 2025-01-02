import { Router } from "express";
import { HistoryMiddleware } from "./history.middleware";
import Container from "typedi";
import { HistoryController } from "./history.controller";
import { AuthMiddleware } from "../auth/auth.middleware";
import { Role } from "../user/types/user.type";
import { HistoryCreateDTO } from "./dto/history.dto";

const historyRouter = Router();
const historyMiddleware = new HistoryMiddleware();
const authMiddleware = Container.get(AuthMiddleware);
const historyController = Container.get(HistoryController);

historyRouter.post(
  "/history",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  historyMiddleware.validate(HistoryCreateDTO),
  historyController.createHistory
);

historyRouter.get(
  "/histories",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  historyController.getHistoriesByUserId
);

historyRouter.get(
  "/history",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  historyController.getOneHistory
);

historyRouter.get(
  "/histories/:bookId",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  historyController.getHistory
);


historyRouter.delete(
  "/histories/:historyId",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  historyController.deleteHistory
);

export default historyRouter;
