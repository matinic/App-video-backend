import { Operation } from "@prisma/client/runtime/library";
import { PrismaClient, User } from "../generated/prisma";
import { CommentDto } from "@/utils/validations/comment/dto"


const prismaClient = new PrismaClient()
const { comment } = prismaClient

export default {
    async createComment ({content, videoId, userId}: CommentDto.NewVideoCommentDto ){
        return comment.create({
            data:{
                comment: content,
                video:{
                    connect:{
                        videoId
                    }
                },
                user:{
                    connect:{
                        userId
                    }
                }
            }
        })
    }
} 




