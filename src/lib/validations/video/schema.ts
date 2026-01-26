import { idSchema, nameSchema, paginationSchema, orderBySchema } from "../base.schema"
import { z } from "zod"

export const tagSchema = z.array(z.object({name: z.string().uuid()})).optional()

export const orderByVideosSchema = z.object({
    orderBy: z.object({
        createdAt: orderBySchema.default("asc"),
        views: orderBySchema.optional(),
        title: orderBySchema.optional(),
    }).optional()
})

export const createVideoSchema = z.object({
    title: z.string(),
    url: z.string(),
    authorId: idSchema.shape.id,
    categoryId: idSchema.shape.id,
    description: z.string(),
    thumbnail: z.string().optional(),
    tags: tagSchema
})

export const videoUserSchema = z.object({
    userId: idSchema.shape.id,
    videoId: idSchema.shape.id,
})

export const videoUserStatusSchema = z.object({
    ...videoUserSchema.shape,
    isLike: z.boolean()
})

export const paginationAndOrderVideosSchema = z.object({
    ...paginationSchema.shape,
    ...orderByVideosSchema.shape
})

export const getChannelVideosSchema = z.object({
    name: nameSchema.shape.name,
    ...orderByVideosSchema.shape,
    ...paginationSchema.shape
})

export const filterParamsSchema = z.object({
    filterParams:z.object({
        category: z.string().min(1),
        rating: z.coerce.number().refine( val => {
             return  val <= 5 && val >= 0
         }),
        tags: tagSchema
    })
})

export const getVideosBySearch = z.object({
    keywords: z.string().transform((val) => {
        return val
        .trim()
        .split(/\s+/) // separar por espacios, múltiple
        .filter(Boolean); // evitar strings vacíos
    }),
    ...filterParamsSchema.shape,
    ...orderByVideosSchema.shape,
    ...paginationSchema.shape,
})

export const updateVideoSchema = z.object({
    videoId: idSchema.shape.id,
    userId: idSchema.shape.id,
    title: z.string().optional(),
    description: z.string().optional(),
    url: z.string().url().optional(),
})

export const getEvaluatedVideosWithPagination = z.object({
    ...videoUserStatusSchema.shape,
    ...paginationSchema.shape,
    cursor: z.object({
        videoId_userId: z.object({
            userId: z.string(),
            videoId: z.string()
        })
    }).optional()
})

export const videoIdSchema = z.object({
    videoId: idSchema.shape.id,
})



