import { Request, Response } from "express";
import notificationService from "@/services/notification.service";
import notificationFormat from "@/lib/notification/out.format.helper"

export default {

     async updateNotification(req:Request, res:Response){
        try{
            const { id } = req.user
            await notificationService.updateNotification({ id })
            res.status(200).json({message: "Notification updated successfully"})
            return
        }catch(error){
            if(error instanceof Error){
                console.log(error.message)
                res.status(500).json({message: "Something wrong happend while sending the notification"})
            }
        }
    },
    async getNotifications(req:Request, res:Response){
        try {
            const { id } = req.user
            const notificationsFound = await notificationService.getNotification({ id })
            const notificationsCount = await notificationService.getNotificationCount({ id })
            const notifications = notificationFormat(notificationsFound)
            res.status(200).json({
                notifications,
                _count: notificationsCount
            })
            return
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message)
                res.status(500).json({message: "An error happend while getting notifications"})
            }
        }
    },
}
