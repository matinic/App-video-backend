import { Router } from "express";
import notificationController from "../controllers/notification.controller";
import notificationSchema from "../utils/zod/notification/schema";
import userSchema from "../utils/zod/user/schema";
import { auth } from "../utils/middlewares/auth.jwt"
import validateZodSchema from "../utils/middlewares/validate.zod.schema";


const router = Router()
const { reqBody } = validateZodSchema

//PUT
router.put( "/", reqBody( notificationSchema.updateNotificationSchema ), notificationController.updateNotification )

router.use(auth)
//GET 
router.get("/", auth, reqBody( userSchema.userIdSchema ), notificationController.getNotifications)

//POST
router.post( "/new-video", reqBody( notificationSchema.createVideoNotificationSchema ), notificationController.createVideoNotification )
router.post( "/new-comment", reqBody( notificationSchema.createCommentNotificationSchema ), notificationController.createCommentNotification )
router.post( "/response-notification", reqBody( notificationSchema.createResponseNotificationSchema ), notificationController.createResponseNotification )
router.post( "/new-message", reqBody( notificationSchema.createMessageNotificationSchema ), notificationController.createMessageNotification )
router.post( "/send-notification", reqBody( notificationSchema.updateNotificationSchema ), notificationController.updateNotification )




export default router