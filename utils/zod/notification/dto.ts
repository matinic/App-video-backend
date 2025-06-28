import { z } from "zod"
import notificationSchema from "./schema"

export namespace NotificationDto  {
    export type CreateVideoNotificationDto = z.infer<typeof notificationSchema.createVideoNotificationSchema>
    export type CreateCommentNotificationDto = z.infer<typeof notificationSchema.createCommentNotificationSchema>
    export type UpdateNotificationStatusDto = z.infer<typeof notificationSchema.updateNotificationStatusSchema>
    export type UpdateNotificationDto = z.infer<typeof notificationSchema.updateNotificationSchema>
    export type GetNotificationDto = z.infer<typeof notificationSchema.getNotificationSchema>
    export type CreateResponseNotificationDto = z.infer<typeof notificationSchema.createResponseNotificationSchema>
    export type CreateMessageNotificationDto = z.infer<typeof notificationSchema.createMessageNotificationSchema>
}