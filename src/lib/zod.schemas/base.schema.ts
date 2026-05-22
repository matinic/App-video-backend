import { z } from "zod"

export const dateSchema = z.date()
export const emailSchema = z.email()
export const nameSchema = z.string()
export const passwordSchema = z.string().max(32)
export const orderBySchema = z.enum(["asc","desc"])
export const idSchema = z.uuid()
export const paginationSchema = z.object({
    skip: z.coerce.number().positive().optional(),
    take: z.coerce.number().positive().optional(),
    cursor: z.object({
        createdAt: dateSchema,
        id: idSchema
    })
}).optional()

export namespace BaseDto {
    export type dateDto = z.infer<typeof dateSchema>
    export type emailDto = z.infer<typeof emailSchema>
    export type nameDto = z.infer<typeof nameSchema>
    export type passwordDto = z.infer<typeof passwordSchema>
    export type orderByDto = z.infer<typeof orderBySchema>
    export type idDto = z.infer<typeof idSchema>
    export type paginationDto = z.infer<typeof paginationSchema>
}


