import { z } from "zod"

export default {
    createVideoNotificationSchema: z.object({
        userId: z.string().uuid(),
        videoId: z.string(),
    }),
    createCommentNotificationSchema: z.object({
        userId: z.string().uuid(),
        commentId: z.string().uuid()
    }),
    createResponseNotificationSchema: z.object({
        userId: z.string().uuid(),
        responseId: z.string().uuid(),
    }),
    createMessageNotificationSchema: z.object({
        userId: z.string().uuid(),
        messageId: z.string().uuid()
    }),
    getNotificationSchema: z.object({
        userId: z.string().uuid(),
        notificationId: z.string().uuid()
    }),
    notificationIdSchema: z.object({
        notificationId: z.string()
    }),
    updateNotificationSchema: z.object({
        userDestinationIdList: z.array(z.object({
            id: z.string().uuid()
        })),
        notificationId: z.string()
    }),
    updateNotificationStatusSchema: z.object({
        notificationId: z.string().uuid(),
        read: z.boolean()  
    })
} 