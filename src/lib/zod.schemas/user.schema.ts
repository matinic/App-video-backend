import { z } from "zod"
import { nameSchema, emailSchema, passwordSchema, orderBySchema, paginationSchema, idSchema } from "./base.schema"
import { DICTIONARY } from "@/lib/dictionay" 

export const orderUsersBySchema = z.object({
    [DICTIONARY.DATE.CREATED_AT]: orderBySchema.optional(),
    [DICTIONARY.DATE.UPDATED_AT]: orderBySchema.optional(),
    [DICTIONARY.USER.NAME]: orderBySchema.optional(),
})

export const checkUserSchema = z.object({
    [DICTIONARY.USER.NAME]: nameSchema,
    [DICTIONARY.USER.EMAIL]: emailSchema
})

export const authUserSchema = z.object({
    [DICTIONARY.USER.USER_ID]: idSchema,
    [DICTIONARY.USER.NAME]: nameSchema
})

export const createUserSchema = z.object({
    [DICTIONARY.USER.NAME]: nameSchema,
    [DICTIONARY.USER.EMAIL]: emailSchema,
    [DICTIONARY.USER.PASSWORD]: passwordSchema
})

export const getSessionSchema = z.object({
    [DICTIONARY.USER.EMAIL]: z.string(),
    [DICTIONARY.USER.PASSWORD]: passwordSchema,
})

export const getSubscribersListSchema = z.object({
    ...paginationSchema,
    [DICTIONARY.PAGINATION.CURSOR]: z.object({
        channelId_subscriberId: z.object({
            [DICTIONARY.USER.USER_ID]: z.string(),
            [DICTIONARY.USER.SUBSCRIBER_ID]: z.string()
        }),
        createdAt: z.date()
    }).optional(),
    [DICTIONARY.USER.USER_ID]: idSchema,
})

export const updateTokenSchema = z.object({
    refreshToken: z.string(),
    [DICTIONARY.USER.USER_ID]: idSchema
})

export const subscriptionSchema = z.object({
    [DICTIONARY.USER.USER_ID]: idSchema,
    [DICTIONARY.USER.SUBSCRIPTION]: idSchema,
})

export namespace UserDto {
    export type CreateUserDto = z.infer<typeof createUserSchema>
    export type GetSessionDto = z.infer<typeof getSessionSchema>
    export type AuthUserDto = z.infer<typeof authUserSchema>
    export type SubscriptionDto = z.infer<typeof subscriptionSchema>
    export type UpdateTokenDto = z.infer<typeof updateTokenSchema>
    export type GetSubscribersListDto = z.infer<typeof getSubscribersListSchema>
    export type CheckUserDto = z.infer<typeof checkUserSchema>
    export type OrderUsersByDto = z.infer<typeof orderUsersBySchema>
}  



