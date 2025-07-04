import { Request, Response } from "express";
import notificationService from "../services/notification.service";
import { NotificationDto } from "../utils/zod/notification/dto"
import { UserDto } from "../utils/zod/user/dto"
import notificationFormat from "../utils/notifications.type/map"

export default {
    createNewVideoNotification: async(req:Request<{},{},NotificationDto.CreateNewVideoNotificationDto>,res:Response)=>{
        try {
            const notification = await notificationService.createNewVideoNotification(req.body)
            const userDestinationIdList = notification.userEmmiter.subscriptors
            const notificationId = notification.id
            await notificationService.updateNotification({
                userDestinationIdList,
                notificationId
            })
            res.status(200).json({
                message: "New video notification send successfully",
            })
            return
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message)
                res.status(500).json({message: "Something wrong happend while sending notifications"})
            }
        }
    },
    createNewCommentOnVideoNotification: async(req:Request<{},{},NotificationDto.CreateNewCommentOnVideoNotificationDto>,res:Response)=>{
        try {
            const notification = await notificationService.createNewCommentOnVideoNotification(req.body)
            const userDestinationIdList:NotificationDto.UpdateNotificationDto["userDestinationIdList"] = [{id: notification.userEmmiter.comments[0].video.authorId}]
            const notificationId = notification.id
            await notificationService.updateNotification({
                userDestinationIdList,
                notificationId
            })
            res.status(200).json({
                message: "Comment notification send successfully",
            })
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message)
                res.status(500).json({message: "Something wrong happend while sending notifications"})
            }
        }
    },
    createNewCommentResponseNotification: async(req:Request<{},{},NotificationDto.CreateNewCommentResponseNotificationDto>, res:Response)=>{
        try {
            //check if useremmiter response and comment are the same, if they are equal the notification will not be created
            const comment = `commentService.getComment(responseId)
            if(comment.comment.user.id === req.body.responseId){
                res.status(400).json({message: "Notification Cancelled"})
                return 
            }`
            const notification = await notificationService.createNewCommentResponseNotification(req.body)
            if( notification.userEmmiter.comments[0].comment){
                const userDestinationIdList:NotificationDto.UpdateNotificationDto["userDestinationIdList"] = [{id: notification.userEmmiter.comments[0].comment.userId}]
                const notificationId = notification.id 
                    await notificationService.updateNotification({
                    userDestinationIdList,
                    notificationId
                })
                res.status(200).json({
                    message: "Comment notification send successfully",
                })
                return
            }else{
                res.status(404).json({message: "Notification was not send: Comment not found"})
                return
            }
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message)
                res.status(500).json({message: "Something wrong happend while sending notifications"})
            }
        }
    },
    createNewMessageNotification: async(req:Request<{},{},NotificationDto.CreateNewMessageNotificationDto>,res:Response)=>{
        try {
            const notification = await notificationService.createNewMessageNotification(req.body)
            const userDestinationIdList:NotificationDto.UpdateNotificationDto["userDestinationIdList"] = [{id: notification.userEmmiter.messagesSend[0].receiverId}]
            const notificationId = notification.id
            await notificationService.updateNotification({
                userDestinationIdList,
                notificationId
            })
            res.status(200).json({
                message: "Message notification send"
            })
            return
        } catch (error) {
              if(error instanceof Error){
                console.log(error.message)
                res.status(500).json({message: "Something wrong happend while sending notifications"})
            }
        }
    },
    updateNotification: async(req:Request<{},{},NotificationDto.UpdateNotificationDto>,res:Response)=>{
        try{
            await notificationService.updateNotification(req.body)
            res.status(200).json({message: "Notification send successfully"})
            return
        }catch(error){
            if(error instanceof Error){
                console.log(error.message)
                res.status(500).json({message: "Something wrong happend while sending the notification"})
            }
        }
    },
    getNotifications: async(req:Request<{},{},UserDto.UserIdDto>,res:Response) =>{
        try {
            const notificationsFound = await notificationService.getNotification(req.body)
            const notifications = notificationFormat(notificationsFound)
            res.status(200).json(notifications)
            return
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message)
                res.status(500).json({message: "An error happend while getting notifications"})
            }
        }
    },
    getNotificationCount: async(req:Request<{},{},UserDto.UserIdDto>, res:Response)=>{
        try {
            const notificationsCount = await notificationService.getNotificationCount(req.body)
            res.status(200).json({notificationsCount})
            return
        } catch (error) {
                if(error instanceof Error){
                console.log(error.message)
                res.status(500).json({message: "An error happend while counting notifications"})
            }
        }
    }
}
