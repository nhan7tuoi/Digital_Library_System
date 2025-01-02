import mongoose from 'mongoose';
import { Status } from '../types/notification.type';

const notificationSchema = new mongoose.Schema(
    {
    title: { type: String, required: true },
    content: { type: String, required: true },
    filterCondition: { type: Object},
    data: { type: Object},
    image: { type: String },
    status: { type: String, enum: [Status.PENDING, Status.SENDING, Status.SENDED], default: Status.PENDING },
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;