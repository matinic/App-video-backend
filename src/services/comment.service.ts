
import { CommentDto } from "@/lib/zod/dto/comment"
import { PrismaClient } from "@prisma/client"

class CommentService {
    constructor(private prisma: PrismaClient) {}

    async createComment ({content, videoId, userId}: CommentDto.NewCommentDto ){
        return this.prisma.comment.create({
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
    }
    async getCommentsFromVideo ({ videoId, ...paginationAndOrder}: CommentDto.GetVideoCommentsDto){
        return this.prisma.comment.findMany({
            where: {
                videoId
            },
            ...paginationAndOrder
        })
    }
    async getUserComments ({ userId, ...paginationAndOrder}: CommentDto.GetUserCommentsDto){
        return this.prisma.comment.findMany({
            where:{
                userId
            },
            ...paginationAndOrder
        })
    }
    async updateComment ({ id, content }: CommentDto.UpdateCommentDto){
        return this.prisma.comment.update({
            where:{
                id
            },
            data:{
                content
            }
        })
    }
    async deleteComment ( id: string ){
        return this.prisma.comment.update({
            where: {
                id
            },
            data:{
                isDeleted: true
            }
        })
    }
}

export default CommentService; 




