import { z } from "zod"
import notificationSchema from "./schema"

export namespace NotificationDto  {
    export type CreateNewVideoNotificationDto = z.infer<typeof notificationSchema.createNewVideoNotificationSchema>
    export type CreateNewCommentOnVideoNotificationDto = z.infer<typeof notificationSchema.createNewCommentOnVideoNotificationSchema>
    export type CreateNewCommentResponseNotificationDto = z.infer<typeof notificationSchema.createNewCommentResponseNotificationSchema>
    export type CreateNewMessageNotificationDto = z.infer<typeof notificationSchema.createNewMessageNotificationSchema>
    export type UpdateNotificationStatusDto = z.infer<typeof notificationSchema.updateNotificationStatusSchema>
    export type UpdateNotificationDto = z.infer<typeof notificationSchema.updateNotificationSchema>
    export type GetNotificationDto = z.infer<typeof notificationSchema.getNotificationSchema>
}