import {z} from "zod"
import * as commentSchema from "./schema"


export namespace CommentDto  {
    export type NewCommentDto = z.infer<typeof commentSchema.newCommentSchema>
    export type NewResponseCommentDto = z.infer<typeof commentSchema.newResponseCommentSchema>
    export type UpdateCommentDto = z.infer<typeof commentSchema.updateCommentSchema>

}