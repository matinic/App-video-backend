import { z } from "zod"
import { idSchema } from "./base"


export const createNewSubscriptionNotificationSchema = z.object({
    userEmmiterId: idSchema.shape.id,
    userDestinationId: idSchema.shape.id
})

export const createNewVideoNotificationSchema = z.object({
    userEmmiterId: idSchema.shape.id,
    videoId: idSchema.shape.id,
    userDestinationIdList: z.array(z.object({ userDestinationId: idSchema.shape.id }))
})

export const createNewCommentOnVideoNotificationSchema = z.object({
    userEmmiterId: idSchema.shape.id,
    commentId: idSchema.shape.id,
    videoId: idSchema.shape.id,
    userDestinationId: idSchema.shape.id
})

export const createNewCommentResponseNotificationSchema = z.object({
    userEmmiterId: idSchema.shape.id,
    responseId: idSchema.shape.id,
    userDestinationId: idSchema.shape.id
})

export const createNewMessageNotificationSchema = z.object({
    userEmmiterId: idSchema.shape.id,
    messageId: idSchema.shape.id,
    userDestinationId: idSchema.shape.id
})

export const getNewNotificationSchema = z.object({
    userDestinationId: idSchema.shape.id,
    notificationId: idSchema.shape.id
})

export const updateNotificationStatusSchema = z.object({
    notificationId: idSchema.shape.id,
    read: z.boolean()  
})
