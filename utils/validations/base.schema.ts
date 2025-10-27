import {z} from "zod"

export const idSchema = z.object({
    id: z.string().uuid()
})

export const nameSchema = z.object({
    name: z.string().min(1).max(16)
})

export const emailSchema = z.object({
    email: z.string().email()
})

export const passwordSchema = z.object({
    password: z.string().max(32)
})

export const cursorSchema = z.object({
    cursor: z.object({
        id: idSchema.shape.id,
        createdAt: z.date()
    }).optional()
})

export const paginationSchema = z.object({
    take: z.coerce.number().positive().default(12).optional(),
    ...cursorSchema.shape
})

export const  orderBySchema = z.enum(["asc","desc"]).default("asc")

export const paginationAndOrder = z.object({
    ...paginationSchema.shape,
    orderBySchema
})



