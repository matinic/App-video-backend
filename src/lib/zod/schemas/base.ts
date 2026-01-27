import {z} from "zod"

export const idSchema = z.object({
    id: z.uuid()
})

export const nameSchema = z.object({
    name: z.string().min(1).max(16)
})

export const emailSchema = z.object({
    email: z.email()
})

export const passwordSchema = z.object({
    password: z.string().max(32)
})

export const orderBySchema = z.enum(["asc","desc"])

export const paginationSchema = z.object({
    take: z.coerce.number().positive().default(12).optional(),
    cursor: z.object({
        ...idSchema.shape,
        createdAt: z.date(),
        skip: z.number().default(1)
    }).optional()
})





