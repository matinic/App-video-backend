import {z} from "zod"
import userSchema from "./schema"

export namespace UserDto {
    export type GetUsersDto = z.infer<typeof userSchema.getUsersSchema>
    export type CreateUserDto = z.infer<typeof userSchema.createUserSchema>
    export type GetSessionDto = z.infer<typeof userSchema.getSessionSchema>
    export type UserIdDto = z.infer<typeof userSchema.userIdSchema>
    export type SubscriptionDto = z.infer<typeof userSchema.subscriptionSchema>
    export type UpdateTokenDto = z.infer<typeof userSchema.updateTokenSchema>
    export type EmailDto = z.infer<typeof userSchema.emailSchema>
    export type NameDto = z.infer<typeof userSchema.nameSchema>
    export type PasswordDto = z.infer<typeof userSchema.passwordSchema>
}                    