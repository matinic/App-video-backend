import { z } from "zod"
import { nameSchema, emailSchema, passwordSchema, orderBySchema, paginationSchema, idSchema } from "./base.schema"

export const orderUsersBySchema = z.object({
    createdAt: orderBySchema.optional(),
    updatedAt: orderBySchema.optional(),
    userName: orderBySchema.optional(),
})

export const userAuthSchema = z.object({
    id: idSchema,
    name: z.string(),
})

export const getUserSchema = z.object({
    name: z.string(),
    auth: z.boolean().optional()
})

export const createUserSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: z.string()
})

export const getSessionSchema = z.object({
    userEmail: z.string(),
    userPassword: passwordSchema,
})

export const cursorSchema = z.object({
    followerId_channelId: z.object({
        followerId: z.uuid(),
        channelId: z.uuid()
    })
})

export const getChannelsFollowingSchema = z.object({
    id: idSchema,   
    take: z.coerce.number().optional(),
    skip: z.coerce.number().optional(),
    cursor: cursorSchema.optional()
})

export const updateTokenSchema = z.object({
    refreshToken: z.string(),
    userId: idSchema
})

export const getFollowStatus = z.object({
    followerId: idSchema,
    channelId: idSchema,
})

export const getUserSessionSchema = z.object({
    requiredData: z.string(),
    password: z.string()
})


export namespace UserDto {
    export type CreateUserDto = z.infer<typeof createUserSchema>
    export type GetSessionDto = z.infer<typeof getSessionSchema>
    export type UserAuthDto = z.infer<typeof userAuthSchema>
    export type GetFollowStatusDto = z.infer<typeof getFollowStatus>
    export type UpdateTokenDto = z.infer<typeof updateTokenSchema>
    export type GetChannelsFollowingDto = z.infer<typeof getChannelsFollowingSchema>
    export type GetUserDto = z.infer<typeof getUserSchema>
    export type OrderUsersByDto = z.infer<typeof orderUsersBySchema>
    export type GetUserSessionDto = z.infer<typeof getUserSessionSchema>
}  




