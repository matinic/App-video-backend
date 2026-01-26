
import { CommentDto } from "@/lib/validations/comment/dto"
import client from "@/lib/client"

const { comment } = client

export default {
    async createComment ({content, videoId, userId}: CommentDto.NewCommentDto ){
        return comment.create({
            data:{
                content,
                downvotes: 0,
                upvotes: 1,
                video:{
                    connect:{
                        id: videoId
                    }
                },
                author:{
                    connect:{
                        id: userId
                    }
                }
            }
        })
    },
    async getCommentsFromVideo ({ videoId, ...paginationAndOrder}: CommentDto.GetVideoCommentsDto){
        return comment.findMany({
            where: {
                videoId
            },
            ...paginationAndOrder
        })
    },
    async getUserComments ({ userId, ...paginationAndOrder}: CommentDto.GetUserCommentsDto){
        return comment.findMany({
            where:{
                userId
            },
            ...paginationAndOrder
        })
    },
    async updateComment ({ id, content }: CommentDto.UpdateCommentDto){
        return comment.update({
            where:{
                id
            },
            data:{
                content
            }
        })
    },
    async deleteComment ( id: string ){
        return comment.update({
            where: {
                id
            },
            data:{
                isDeleted: true
            }
        })
    }
} 




