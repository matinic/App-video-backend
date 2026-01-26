import * as videoSchema from "./schema";
import { UserDto } from "@/utils/validations/user/dto"
import {z} from "zod"

export namespace VideoDto {
    export type CreateVideoDto = z.infer<typeof videoSchema.createVideoSchema>
    export type UpdateVideoDto = z.infer<typeof videoSchema.updateVideoSchema> 
    export type GetVideosBySearchDto = z.infer<typeof videoSchema.getVideosBySearch> 
    export type GetChannelVideosDto = z.infer<typeof videoSchema.getChannelVideosSchema>
    export type VideoUserStatusDto = z.infer<typeof videoSchema.videoUserStatusSchema>
    export type VideoUserDto = z.infer<typeof videoSchema.videoUserSchema>
    export type PaginationAndOrderVideosDto = z.infer<typeof videoSchema.paginationAndOrderVideosSchema>
    export type GetEvaluatedVideosWithPaginationDto = z.infer<typeof videoSchema.getEvaluatedVideosWithPagination>
    export type VideoIdDto = z.infer<typeof videoSchema.videoIdSchema>
}