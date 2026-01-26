import {z} from "zod"
import * as commentSchema from "./schema"


export namespace CommentDto  {
    export type NewCommentDto = z.infer<typeof commentSchema.newCommentSchema>
    export type NewResponseCommentDto = z.infer<typeof commentSchema.newResponseCommentSchema>
    export type UpdateCommentDto = z.infer<typeof commentSchema.updateCommentSchema>
    export type PaginationAndOrderCommentDTo = z.infer<typeof commentSchema.paginationAndOrderCommentSchema>
    export type GetVideoCommentsDto = z.infer<typeof commentSchema.getCommentsFromVideoSchema>
    export type GetUserCommentsDto = z.infer<typeof commentSchema.getUserCommentsSchema>
}