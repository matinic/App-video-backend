import { z } from "zod"
import { nameSchema, emailSchema, passwordSchema, orderBySchema, paginationSchema, idSchema } from "./base.schema"
import { DICTIONARY } from "@/lib/dictionay" 

export const orderUsersBySchema = z.object({
    createdAt: orderBySchema.optional(),
    updatedAt: orderBySchema.optional(),
    userName: orderBySchema.optional(),
})

export const checkUserSchema = z.object({
    userName: nameSchema,
    userEmail: emailSchema
})

export const userAuthSchema = z.object({
    userId: idSchema,
    userName: nameSchema
})

export const createUserSchema = z.object({
    userName: nameSchema,
    userEmail: emailSchema,
    userPassword: passwordSchema
})

export const getSessionSchema = z.object({
    userEmail: z.string(),
    userPassword: passwordSchema,
})

export const cursorSchema = z.object({
    followerId_followingId: z.object({
        followerId: z.uuid(),
        followingId: z.uuid()
    })
})

export const getFollowsSchema = z.object({
    userId: idSchema,   
    take: z.coerce.number(),
    skip: z.coerce.number(),
    cursor: cursorSchema
})



export const updateTokenSchema = z.object({
    refreshToken: z.string(),
    userId: idSchema
})

export const followSchema = z.object({
    userFollowingId: idSchema,
    userFollowerId: idSchema,
})

export namespace UserDto {
    export type CreateUserDto = z.infer<typeof createUserSchema>
    export type GetSessionDto = z.infer<typeof getSessionSchema>
    export type UserAuthDto = z.infer<typeof userAuthSchema>
    export type FollowDto = z.infer<typeof followSchema>
    export type UpdateTokenDto = z.infer<typeof updateTokenSchema>
    export type GetFollowsDto = z.infer<typeof getFollowsSchema>
    export type CheckUserDto = z.infer<typeof checkUserSchema>
    export type OrderUsersByDto = z.infer<typeof orderUsersBySchema>
}  



