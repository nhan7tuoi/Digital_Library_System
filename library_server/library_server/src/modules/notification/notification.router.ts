import { Router } from "express";
import Container from "typedi";
import { NotificationController } from "./notification.controller";
import { AuthMiddleware } from "../auth/auth.middleware";
import { Role } from "../user/types/user.type";

const notificationRouter = Router();
const notificationController = Container.get(NotificationController);
const authMiddleware = Container.get(AuthMiddleware);


notificationRouter.post("/notification", notificationController._createNotification);
notificationRouter.get("/notifications", notificationController._getNotifications);
//query: id
notificationRouter.get("/notification", notificationController._getNotificationById);
//query: id
notificationRouter.delete("/notifications/:bookId", notificationController._deleteNotification);
//query: id
notificationRouter.put("/notification", notificationController._updateSendingStatus);

notificationRouter.get("/user/notifications",
     authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
     notificationController._getNotificationByUser);
//query: id
notificationRouter.post("/notification/mark-as-read",
        authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
        notificationController._markAsRead);


export default notificationRouter;

