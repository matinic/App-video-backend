import { z } from "zod"
import { idSchema, paginationSchema } from "./base.schema"

export const getNotificationSchema = z.object({
    userId: idSchema,
    notificationId: idSchema,
})
export const createNotificationSchema = z.object({
    recipientsUserId: z.array(z.uuid()),
    notificationMetadata: z.json().optional(),
    notificationTitle: z.string(),
})
export const getAllNotificationsSchema = z.object({
    userId: idSchema,
    
})
export const markNotificationsAsReadSchema = z.object({
    userId: idSchema, 
    notificationId:z.array(idSchema)
})

export const sendNotificationsSchema = z.object({
    notificationId: idSchema,
    recipientsUserId: z.array(idSchema),
})

export namespace NotificationDto {
    export type GetNotificationDto = z.infer<typeof getNotificationSchema>
    export type GetAllNotificationsDto = z.infer<typeof getAllNotificationsSchema>
    export type CreateNotificationDto = z.infer<typeof createNotificationSchema>
    export type MarkNotificationsAsReadDto = z.infer<typeof markNotificationsAsReadSchema>
    export type SendNotificationsDto = z.infer<typeof sendNotificationsSchema>
}



