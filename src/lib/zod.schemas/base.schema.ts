import { z } from "zod"

export const dateSchema = z.date()
export const emailSchema = z.email()
export const nameSchema = z.string()
export const passwordSchema = z.string().max(32)
export const orderBySchema = z.enum(["asc","desc"])
export const idSchema = z.uuid()
export const cursorSchema = z.object({
    createdAt: dateSchema,
    id: idSchema
})
export const paginationSchema = z.object({
    skip: z.coerce.number().positive().optional(),
    take: z.coerce.number().positive().optional(),
})

export namespace BaseDto {
    export type DateDto = z.infer<typeof dateSchema>
    export type EmailDto = z.infer<typeof emailSchema>
    export type NameDto = z.infer<typeof nameSchema>
    export type PasswordDto = z.infer<typeof passwordSchema>
    export type OrderByDto = z.infer<typeof orderBySchema>
    export type IdDto = z.infer<typeof idSchema>
    export type PaginationDto = z.infer<typeof paginationSchema>
    export type CursorDto = z.infer<typeof cursorSchema>
}


