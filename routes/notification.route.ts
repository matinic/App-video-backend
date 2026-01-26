import { Router } from "express";
import notificationController from "@/controllers/notification.controller";
import * as notificationSchema from "@/utils/validations/notification/schema";
import auth  from "@/utils/middlewares/auth.jwt"
import validate from "@/utils/middlewares/validate/middleware";


const router = Router()

//PUT
router.put( "/", validate( notificationSchema.updateNotificationStatusSchema, "body" ), notificationController.updateNotification )

//GET 
router.get("/", auth(), notificationController.getNotifications)

export default router