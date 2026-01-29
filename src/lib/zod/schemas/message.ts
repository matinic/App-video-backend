// src/lib/zod/schemas/message.ts
import { z } from "zod"
import { idSchema, orderBySchema, paginationSchema } from "./base"

const contentSchema = z.string().min(1).max(5000)

export const createMessageSchema = z.object({
    content: contentSchema,
    senderId: idSchema.shape.id,
    receiverId: idSchema.shape.id,
})

export const updateMessageSchema = z.object({
    id: idSchema.shape.id,
    content: contentSchema,
})

export const getMessageByIdSchema = z.object({
    id: idSchema.shape.id,
})

export const deleteMessageSchema = z.object({
    id: idSchema.shape.id,
})

export const getConversationSchema = z.object({
    userId: idSchema.shape.id,
    contactId: idSchema.shape.id,
    ...paginationSchema.shape,
})

export const getUserMessagesSchema = z.object({
    userId: idSchema.shape.id,
    ...paginationSchema.shape,
})