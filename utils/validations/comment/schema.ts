import { z } from "zod"
import { idSchema, orderBySchema } from "../base.schema"

export const orderByCommentSchema = z.object({
    orderBy: z.object({
        createAt: orderBySchema.default("asc"),
        popular: orderBySchema.optional()
    })
})

export const newCommentSchema = z.object({
    content: z.string(),
    videoId: idSchema.shape.id,
})

export const newResponseCommentSchema = z.object({
    content: z.string(),
    fatherCommentId: idSchema.shape.id,
})

export const updateCommentSchema = z.object({
    content: z.string(),
    commentId: idSchema.shape.id
})


                        