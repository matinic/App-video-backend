import {z} from "zod"
import  * as userSchema from "./schema"

export namespace UserDto {
    export type CreateUserDto = z.infer<typeof userSchema.createUserSchema>
    export type GetSessionDto = z.infer<typeof userSchema.getSessionSchema>
    export type AuthUserDto = z.infer<typeof userSchema.authUserSchema>
    export type SubscriptionDto = z.infer<typeof userSchema.subscriptionSchema>
    export type UpdateTokenDto = z.infer<typeof userSchema.updateTokenSchema>
    export type CheckDto = z.infer<typeof userSchema.checkSchema>
    export type GetSubscribersListDto = z.infer<typeof userSchema.getSubscribersListSchema>
    export type CheckUserDto = z.infer<typeof userSchema.checkUserSchema>
    export type OrderUsersByDto = z.infer<typeof userSchema.orderUsersBySchema>
}                    