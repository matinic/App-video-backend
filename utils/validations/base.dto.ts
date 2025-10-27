import * as baseSchema from "./base.schema"
import {z} from "zod"

export namespace BaseDto {
    export type IdDto = z.infer<typeof baseSchema.idSchema> 
    export type OrderByDto = z.infer<typeof baseSchema.orderBySchema> 
    export type NameDto = z.infer<typeof baseSchema.nameSchema> 
    export type PaginationDto = z.infer<typeof baseSchema.paginationSchema>
    export type PasswordDto = z.infer<typeof baseSchema.passwordSchema>
    export type EmailDto = z.infer<typeof baseSchema.emailSchema>
    export type CursorDto = z.infer<typeof baseSchema.cursorSchema>
}