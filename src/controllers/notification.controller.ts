import { Request, Response } from "express";
import NotificationService from "@/services/notification.service";

import { HttpError } from "@/lib/errors/http.error";

export default class NotificationController {
    constructor(private notificationService: NotificationService){}
   
    async getNotification(req:Request, res:Response): Promise<void>{
        const { userId } = req.user;
        const { id } = req.validatedParams;
        const notification = await this.notificationService.getNotification({ notificationId: id, userId });
        if(!notification){
            throw new HttpError(404,"notification not found")
        }
        res.status(200).json(notification);
        return
    }
    
    async getNotifications(req:Request, res:Response){
        const { id } = req.user;
        const pagination = req.validatedQuery;
        const notifications = await this.notificationService.getAllNotifications()
    }

    async updateBulkNotifications(req:Request, res:Response){

    }
    
    async deleteNotification(req:Request, res:Response){

    }

    

}
