import { Router } from "express";
import { UserMiddleware } from "./user.middleware";
import Container from "typedi";
import { UserController } from "./user.controller";
import { UserRegisterDTO, UserUpdateDTO } from "./dto/user.dto";
import { AuthMiddleware } from "../auth/auth.middleware";
import { Role } from "./types/user.type";
import { upload } from "../../aws/aws.helper";

const userRouter = Router();
const userMiddleware = new UserMiddleware();
const userController = Container.get(UserController);
const authMiddleware = Container.get(AuthMiddleware);

userRouter.get(
  "/me",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  userController._getMe
);

userRouter.post(
  "/users/ban-user",
  authMiddleware.authenticateAccessToken([Role.Admin]),
  userController._banUser
);

userRouter.post("/users/find-user", userController._findUserByKeyword);

userRouter.post("/users/fcm-token", userController._postFcmtoken);

userRouter.post(
  "/users/update-user",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  userMiddleware.validateUser(UserUpdateDTO),
  userController._updateUser
);

userRouter.post(
  "/users/update-avatar",
  upload.single("image"),
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  userController._updateAvatar
);

userRouter.post("/users", userController._getAllUsers);
export default userRouter;
