import { Router } from "express";
import Container from '@/container'
import * as notificationSchema from "@/lib/zod/schema/notification";
import auth  from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate";

const notificationController = Container.getNotificationController()


const router = Router()

//PUT
router.put( "/", validate({ body: notificationSchema.updateNotificationStatusSchema }), notificationController.updateNotification.bind(notificationController) )

//GET 
router.get("/", auth(), notificationController.getNotifications.bind(notificationController))

export default router