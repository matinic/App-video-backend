import { z, ZodAny } from "zod"
import {
    nameSchema,
    emailSchema,
    passwordSchema,
    orderBySchema,
    paginationSchema
} from "./base"
import {
    idSchema
} from "./base"

export const orderUsersBySchema = z.object({
    createdAt: orderBySchema.optional(),
    updatedAt: orderBySchema.optional(),
    name: orderBySchema.optional(),
})

export const checkUserSchema = z.object({
    name: nameSchema.shape.name,
    email: emailSchema.shape.email
})

export const authUserSchema = z.object({
    ...idSchema.shape,
    ...nameSchema.shape
})

export const createUserSchema = z.object({
    name: nameSchema.shape.name,
    email: emailSchema.shape.email,
    password: passwordSchema.shape.password
})

export const getSessionSchema = z.object({
    nameOrEmail: z.string(),
    password: passwordSchema.shape.password,
})

export const getSubscribersListSchema = z.object({
    ...paginationSchema.shape,
    cursor: z.object({
        channelId_subscriberId: z.object({
            channelId: z.string(),
            subscriberId: z.string()
        }),
        createdAt: z.date()
    }).optional(),
    id: idSchema.shape.id,
})

export const checkSchema = z.object({
    check: z.boolean().optional(),
})

export const updateTokenSchema = z.object({
    refreshToken: z.string().uuid(),
    userId: idSchema.shape.id
})

export const subscriptionSchema = z.object({
    channelId: idSchema.shape.id,
    subscriberId: idSchema.shape.id,
})





