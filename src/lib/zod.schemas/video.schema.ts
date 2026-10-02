import { orderBySchema, idSchema, paginationSchema, nameSchema } from "./base.schema"
import { boolean, z } from "zod"

export const tagSchema = z.array(z.object({name: z.string()})).optional()

export const orderByVideosSchema = z.object({
    orderBy: z.object({
        createdAt: orderBySchema.default("asc"),
        views: orderBySchema.optional(),
        title: orderBySchema.optional(),
    }).optional()
})

export const createVideoSchema = z.object({
    title: z.string(),
    videoUrl: z.string(),
    authorId: idSchema,
    categoryId: idSchema.optional(),
    description: z.string().max(4000),
    thumbnail: z.string().optional(),
    //tags: tagSchema
})

export const paginationAndOrderVideosSchema = z.object({
    ...paginationSchema.shape,
    ...orderByVideosSchema.shape
})

export const getChannelVideosSchema = z.object({
    userName: nameSchema,
    ...orderByVideosSchema.shape,
    ...paginationSchema.shape
})

export const filterParamsSchema = z.object({
    categoryName: z.string().min(1),
    ratingNumber: z.coerce.number().refine( val => {
        return  val <= 5 && val >= 0
    }),
    tags: tagSchema
})

export const searchVideoSchema = z.object({
    keywords: z.string().transform((val) => {
        return val
        .trim()
        .split(/\s+/) // separar por espacios, múltiple
        .filter(Boolean); // evitar strings vacíos
    }),
    filterParams: z.object({...filterParamsSchema.shape}),
    ...orderByVideosSchema.shape,
    ...paginationSchema.shape,
})

export const userVideoStatus = z.object({
    userId: idSchema,
    videoId: idSchema,
    isLike: z.boolean()
})

export const updateVideoSchema = z.object({
    videoId: idSchema,
    title: z.string().optional(),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
})

export const getFavoriteVideosSchema = z.object({
    ...paginationSchema.shape,
    cursor: z.object({
        videoId_userId: z.object({
            userId: idSchema,
            videoId: idSchema
        })
    }).optional()
})

export const videoIdSchema = z.object({
    videoId: idSchema,
})

export const deleteVideoSchema = z.object({
    videoId: idSchema,
    isDeleted: z.boolean(),
})

export const userVideoStatusSchema = z.object({
    videoId: idSchema,
    userId: idSchema,
    isLike: z.boolean(),
})

export namespace VideoDto {
    export type CreateVideoDto = z.infer<typeof createVideoSchema>
    export type UpdateVideoDto = z.infer<typeof updateVideoSchema>
    export type UserVideoStatusDto = z.infer<typeof userVideoStatusSchema>
    export type SearchVideoDto = z.infer<typeof searchVideoSchema> 
    export type GetChannelVideosDto = z.infer<typeof getChannelVideosSchema>
    export type PaginationAndOrderVideosDto = z.infer<typeof paginationAndOrderVideosSchema>
    export type GetFavoriteVideosDto = z.infer<typeof getFavoriteVideosSchema>
    export type DeleteVideoDto = z.infer<typeof deleteVideoSchema>
}