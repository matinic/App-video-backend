import { z } from "zod"
import * as notificationSchema from "../schemas/notification"

export namespace NotificationDto  {
    export type CreateNewSubscriptionNotificationDto = z.infer<typeof notificationSchema.createNewSubscriptionNotificationSchema>
    export type CreateNewVideoNotificationDto = z.infer<typeof notificationSchema.createNewVideoNotificationSchema>
    export type CreateNewCommentOnVideoNotificationDto = z.infer<typeof notificationSchema.createNewCommentOnVideoNotificationSchema>
    export type CreateNewCommentResponseNotificationDto = z.infer<typeof notificationSchema.createNewCommentResponseNotificationSchema>
    export type CreateNewMessageNotificationDto = z.infer<typeof notificationSchema.createNewMessageNotificationSchema>
    export type UpdateNotificationStatusDto = z.infer<typeof notificationSchema.updateNotificationStatusSchema>
    export type GetNewNotificationDto = z.infer<typeof notificationSchema.getNewNotificationSchema>
}