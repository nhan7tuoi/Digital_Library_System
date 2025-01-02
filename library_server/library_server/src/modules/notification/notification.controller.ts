import { Inject, Service } from "typedi";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";
import { Pagination } from "../../helper/pagination";
import { NotificationService } from "./notification.service";

@Service()

export class NotificationController {
    constructor(@Inject() private notificationService: NotificationService) {}

    _createNotification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.notificationService.createNotification(req.body);
            res.send(new ResponseCustom(result));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    _updateSendingStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.notificationService.updateSendingStatus(req.body.id);
            res.send(new ResponseCustom(result));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    _getNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.notificationService.getNotifications();
            res.send(new ResponseCustom(result));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    _getNotificationById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.notificationService.getNotificationById(req.query.id as string);
            res.send(new ResponseCustom(result));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    _deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.notificationService.deleteNotification(req.params.bookId);
            res.send(new ResponseCustom(result));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    _getNotificationByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.notificationService.getNotificationByUser(req.body.userId);
            res.send(new ResponseCustom(result));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    _markAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.notificationService.markAsRead(req.body.userId, req.body.id as string);
            res.send(new ResponseCustom(result));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}