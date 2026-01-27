import { z } from "zod"
import { idSchema, orderBySchema, paginationSchema } from "./base"

export const orderByCommentSchema = z.object({
    orderBy: z.object({
        createAt: orderBySchema.optional(),
        upvotes: orderBySchema.default("desc")
    })
})

const maxContentCommentSchema = z.string().max(1000); 

export const newCommentSchema = z.object({
    content: maxContentCommentSchema,
    videoId: idSchema.shape.id,
    userId: idSchema.shape.id
})

export const newResponseCommentSchema = z.object({
    content: z.string(),
    fatherCommentId: idSchema.shape.id,
})

export const updateCommentSchema = z.object({
    content: maxContentCommentSchema,
    ...idSchema.shape
})

export const paginationAndOrderCommentSchema = z.object({
    ...orderByCommentSchema.shape,
    ...paginationSchema.shape,
})

export const getCommentsFromVideoSchema = z.object({
    ...paginationAndOrderCommentSchema.shape,
    videoId: idSchema.shape.id,
})

export const getUserCommentsSchema = z.object({
    ...paginationAndOrderCommentSchema.shape,
    userId: idSchema.shape.id
})

