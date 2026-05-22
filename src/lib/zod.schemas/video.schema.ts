import { orderBySchema, idSchema, paginationSchema, nameSchema } from "./base.schema"
import { z } from "zod"
import { DICTIONARY } from "@/lib/dictionay"

export const tagSchema = z.array(z.object({name: z.string()})).optional()

export const orderByVideosSchema = z.object({
    [DICTIONARY.BASE.ORDERBY]: z.object({
        [DICTIONARY.DATE.CREATED_AT]: orderBySchema.default("asc"),
        [DICTIONARY.VIDEO.VIEWS]: orderBySchema.optional(),
        [DICTIONARY.VIDEO.TITLE]: orderBySchema.optional(),
    }).optional()
})

export const createVideoSchema = z.object({
    [DICTIONARY.VIDEO.TITLE]: z.string(),
    [DICTIONARY.BASE.URL]: z.string(),
    [DICTIONARY.VIDEO.AUTHOR_ID]: idSchema,
    [DICTIONARY.CATEGORY.CATEGORY_ID]: idSchema.optional(),
    [DICTIONARY.VIDEO.DESCRIPTION]: z.string().max(4000),
    [DICTIONARY.VIDEO.THUMBNAIL]: z.string().optional(),
    [DICTIONARY.BASE.TAGS]: tagSchema
})

export const addFavouriteVideoSchema = z.object({
    [DICTIONARY.VIDEO.VIDEO_ID]: idSchema,
    [DICTIONARY.USER.USER_ID]: idSchema,
})

export const paginationAndOrderVideosSchema = z.object({
    ...paginationSchema,
    ...orderByVideosSchema
})

export const getChannelVideosSchema = z.object({
    [DICTIONARY.USER.NAME]: nameSchema,
    ...orderByVideosSchema,
    ...paginationSchema
})

export const filterParamsSchema = z.object({
    [DICTIONARY.CATEGORY.CATEGORY_NAME]: z.string().min(1),
    [DICTIONARY.VIDEO.RATING]: z.coerce.number().refine( val => {
        return  val <= 5 && val >= 0
    }),
    [DICTIONARY.BASE.TAGS]: tagSchema
})

export const getVideosBySearch = z.object({
    [DICTIONARY.BASE.KEYWORDS]: z.string().transform((val) => {
        return val
        .trim()
        .split(/\s+/) // separar por espacios, múltiple
        .filter(Boolean); // evitar strings vacíos
    }),
    ...filterParamsSchema.shape,
    ...orderByVideosSchema.shape,
    ...paginationSchema,
})

export const updateVideoSchema = z.object({
    [DICTIONARY.VIDEO.VIDEO_ID]: idSchema,
    [DICTIONARY.VIDEO.VIDEO_TITLE]: z.string().optional(),
    [DICTIONARY.VIDEO.DESCRIPTION]: z.string().optional(),
    [DICTIONARY.BASE.URL]: z.string().optional(),
})

export const getFavoriteVideosSchema = z.object({
    ...paginationSchema,
    [DICTIONARY.PAGINATION.CURSOR]: z.object({
        videoId_userId: z.object({
            [DICTIONARY.USER.USER_ID]: idSchema,
            [DICTIONARY.VIDEO.VIDEO_ID]: idSchema
        })
    }).optional()
})

export const videoIdSchema = z.object({
    [DICTIONARY.VIDEO.VIDEO_ID]: idSchema,
})

export namespace VideoDto {
    export type CreateVideoDto = z.infer<typeof createVideoSchema>
    export type UpdateVideoDto = z.infer<typeof updateVideoSchema> 
    export type GetVideosBySearchDto = z.infer<typeof getVideosBySearch> 
    export type GetChannelVideosDto = z.infer<typeof getChannelVideosSchema>
    export type PaginationAndOrderVideosDto = z.infer<typeof paginationAndOrderVideosSchema>
    export type GetFavoriteVideosDto = z.infer<typeof getFavoriteVideosSchema>
}