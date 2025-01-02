import "reflect-metadata";
import { BullMQAdapter } from "bull-board/bullMQAdapter";
import express from "express";
import ConnectDB from "./database/db";
import userRouter from "./modules/user/user.router";
import { handleErrors } from "./helper/error";
import { createBullBoard } from "bull-board";
import statisticsRouter from "./modules/statistics/statistics.router";
import cors from "cors";
import genreRouter from "./modules/genre/genre.router";
import { Queues } from "./helper/queue";
import authRouter from "./modules/auth/auth.router";
import majorsRouter from "./modules/majors/majors.router";
import historyRouter from "./modules/history/history.router";
import chapterRouter from "./modules/chapter/chapter.router";
import bookRouter from "./modules/book/book.router";
import notificationRouter from "./modules/notification/notification.router";
import cron from "node-cron";
import Notification from "./modules/notification/model/notification.model";
import { Status } from "./modules/notification/types/notification.type";
import { NotificationService } from "./modules/notification/notification.service";
import { UserService } from "./modules/user/user.service";
import Container from "typedi";
import reviewRouter from "./modules/reivew/review.router";
import viewRouter from "./modules/view/view.router";
import noteRouter from "./modules/note/note.router";

(async () => {
  const app = express();

  const port = 3000;

  app.use(cors());

  app.use(express.json());

  await ConnectDB();

  const { router: bullBoardRouter } = createBullBoard([
    new BullMQAdapter(Queues.emailQueue.queue),
  ]);

  const notificationService = Container.get(NotificationService);
  const userService = Container.get(UserService);

  app.use("/admin/queues", bullBoardRouter);

  app.use("/api/v1", userRouter);
  app.use("/api/v1", statisticsRouter);
  app.use("/api/v1", genreRouter);
  app.use("/api/v1", authRouter);
  app.use("/api/v1", majorsRouter);
  app.use("/api/v1", historyRouter);
  app.use("/api/v1", chapterRouter);
  app.use("/api/v1", bookRouter);
  app.use("/api/v1", notificationRouter);
  app.use("/api/v1", reviewRouter);
  app.use("/api/v1", viewRouter);
  app.use("/api/v1", noteRouter);
  app.use(handleErrors);
  app.listen(port, () => {
    return console.log(`Express is running`);
  });

  cron.schedule('*/30 * * * * ', async () => {
    try {
      console.log('Cron job running');
        const notifications = await Notification.find({status: Status.SENDING});
        for (const notification of notifications) {
            const users = await userService.getUserByFilter(notification.filterCondition);
            for(const user of users){
              console.log('Send notification to user:', user.name);
                await notificationService.sendNotification(user._id.toString(), notification._id.toString());
            }
            notification.status = Status.SENDED;
            await notification.save();
            console.log('Send notification success',notification.status);
        }
    } catch (error) {
        console.log(error);
    }
  });
})();
