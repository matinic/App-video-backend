import { z } from "zod"

export default {
    createVideoSchema: z.object({
        title: z.string(),
        url: z.string(),
        userId: z.string()
    }),
    videoIdSchema: z.object({
        videoId: z.string().uuid()
    }),
    getVideosSchema: z.object({
        amount: z.coerce.number().default(12),
        page: z.coerce.number().default(1),
        orderBy: z.enum(["asc","desc"]).default("asc")
    }),
    getVideosByAuthorSchema: z.object({
        authorId: z.string().uuid(),
        amount: z.number().default(12),
        page: z.number().default(1),
        orderBy: z.enum(["asc","desc"]).default("asc")
    }),
    getVideoBySearchQuerySchema: z.object({
        searchQuery: z.string().min(1),
        filterQuery: z.string().optional().nullable()
    }),
    updateVideoSchema: z.object({
        videoId: z.string().uuid(),
        userId: z.string().uuid(),
        title: z.string().optional(),
        description: z.string().optional(),
        url: z.string().url().optional(),
    }),
    likeStatusSchema: z.object({
        videoId: z.string().uuid(),
        userId: z.string().uuid()
    }),
}


