import { Request, Response } from "express";
import notificationFormat from "@/lib/notification/out.format.helper"
import NotificationService from "@/services/notification.service";

export default class NotificationController {
    constructor(private notificationService: NotificationService){}
    
    async updateNotification(req:Request, res:Response){
        const { id } = req.user
        await this.notificationService.updateNotification({ id })
        res.status(200).json({message: "Notification updated successfully"})
    }
    
    async getNotifications(req:Request, res:Response){
        const { id } = req.user
        const notificationsFound = await this.notificationService.getNotification({ id })
        const notificationsCount = await this.notificationService.getNotificationCount({ id })
        const notifications = notificationFormat(notificationsFound)
        res.status(200).json({
            notifications,
            _count: notificationsCount
        })
    }
}
