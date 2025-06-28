import videoSchema from "./schema";
import {z} from "zod"

export namespace VideoDto {
    export type CreateVideoDto = z.infer<typeof videoSchema.createVideoSchema>
    export type VideoIdDto = z.infer<typeof videoSchema.videoIdSchema>
    export type GetVideosDto = z.infer<typeof videoSchema.getVideosSchema>
    export type UpdateVideoDto = z.infer<typeof videoSchema.updateVideoSchema>
    export type LikeStatusDto = z.infer<typeof videoSchema.likeStatusSchema>  
    export type GetVideoByAuthorDto = z.infer<typeof videoSchema.getVideosByAuthorSchema> 
    export type GetVideoBySearchQueryDto = z.infer<typeof videoSchema.getVideoBySearchQuerySchema> 
}