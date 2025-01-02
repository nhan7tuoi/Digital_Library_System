import {Service} from 'typedi';
import {NotificationCreateDTO} from './dto/notification.dto';
import Notification from './model/notification.model';
import Books from '../book/model/book.model';
import { Status } from './types/notification.type';
import User from '../user/model/user.model';
import admin from 'firebase-admin';

import serviceAccount from '../../json-key/serviceAccount.json';
import { ServiceAccount } from 'firebase-admin';
import mongoose from 'mongoose';

try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
    console.log("Firebase Admin SDK đã được khởi tạo thành công");
  } catch (error) {
    console.error("Lỗi khi khởi tạo Firebase Admin SDK:", error);
  }

@Service()
export class NotificationService {
    async createNotification(params:NotificationCreateDTO){
        const {
            title,
            content,
            filterCondition,
            image,
            data,
            status
        } = params;
        const fiterObject = JSON.parse(filterCondition);
        const dataObject = JSON.parse(data);
        const notification = await Notification.create({
            title,
            content,
            filterCondition: fiterObject,
            image,
            data: dataObject,
            status
        });
        return notification;
    }

    async getNotificationById(id:string){
        console.log(id);
        const notification = await Notification.findOne({_id:id});
        const bookids = notification.data;
        const books = await Books.find({_id:{$in:bookids}});

        return books;
    }

    async getNotifications(){
        return await Notification.find();
    }

    async deleteNotification(id:string){
        return await Notification.deleteOne({_id:id});
    }

    async updateSendingStatus(id:string){
        const notification = await Notification.findOne({_id:new mongoose.Types.ObjectId(id)});
        notification.status = Status.SENDING;
        await notification.save();
        return notification;
    }

    async getNotificationByUser(userId:string){
        const user = await User.findOne({_id:userId})
        .populate('notifications.notification');
        const notifications = user.notifications;
        return notifications;
    }

    async markAsRead(userId:string, notificationId:string){
        const user = await User.findOne({_id:userId});
        const notification = user.notifications.find((item:any)=>item.notification == notificationId);
        notification.isRead = true;
        await user.save();
        return notification;
    }

    async sendNotification(
        userId:string,
        notificationId:string,
    ){
        const user = await User.findOne({_id:userId});
        const notification = await Notification.findOne({_id:notificationId});
        const devices = user.devices;
        const fcm_tokens = devices.map((item:any)=>item.fcm_token);
        console.log("tokens",fcm_tokens);
        if(fcm_tokens.length == 0){
            return;
        }
        const message = {
            notification:{
                title:notification.title,
                body:notification.content,
                image:notification.image
            },
            data:{
                notificationId:notificationId,
                books:JSON.stringify(notification.data)
            },
            tokens:fcm_tokens
        }
        admin.messaging().sendEachForMulticast(message)
        .then((response:any)=>{
            console.log("Successfully sent message:",response);

        })
        .catch((error:any)=>{
            console.log(error);
        });

        if(!user.notifications.some((item:any)=>item.notification == notificationId)){
            user.notifications.push({
                notification:notificationId,
                isRead:false
            });
            await user.save();
        }
    }
}