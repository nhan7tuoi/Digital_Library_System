import { Router } from "express";
import Container from "typedi";
import { AuthMiddleware } from "../auth/auth.middleware";
import { ViewController } from "./view.controller";
import { Role } from "../user/types/user.type";

const viewRouter = Router();
const authMiddleware = Container.get(AuthMiddleware);
const viewController = Container.get(ViewController);

viewRouter.post(
  "/view/update",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  viewController.updateView
);

export default viewRouter;
