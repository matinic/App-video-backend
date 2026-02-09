import { Request, Response } from "express";
import CommentService from "@/services/comment.service"
import { HttpError } from "@/lib/errors/http.error"

class CommentController {
    constructor(private commentService: CommentService) {}

    async createComment(req:Request,res:Response){
        await this.commentService.createComment(req.validatedBody);
        res.status(200).json({message: "Comment Created"})
    }

    async getCommentsFromVideo(req:Request,res:Response){
        const { videoId } = req.validatedParams;
        const paginationAndOrder  = req.validatedQuery;
        const commentsFound  = await this.commentService.getCommentsFromVideo({
            ...paginationAndOrder,
            videoId,
        })
        const lastElement = commentsFound.at(-1)
        let cursor;
        if(lastElement){
            cursor = {
                id: lastElement.id,
                createdAt: lastElement.createdAt
            }
        }
        res.status(200).json({
            commentsFound,
            cursor
        })
    }

    async getCommentsFromUser(req:Request,res:Response){
        const userId = req.user.id;
        const paginationAndOrder = req.validatedQuery;
        const commentsFound = await this.commentService.getUserComments({
            ...paginationAndOrder,
            userId
        })
        const lastItem = commentsFound.at(-1);
        let cursor;
        if(lastItem){
            cursor = {
                id: lastItem.id,
                createdAt: lastItem.createdAt
            }
        }
        res.status(200).json({
            commentsFound,
            cursor
        })
    }

    async updateCommentById(req:Request, res:Response){
        const updatedComment = await this.commentService.updateComment(req.validatedBody);
        if(!updatedComment) {
            throw new HttpError(404, "Comment not found");
        }
        res.status(200).json({
            message: "comment updated successfully"
        })
    }

    async deleteComment(req:Request, res:Response){
        const { id } = req.validatedParams;
        const deletedComment = await this.commentService.deleteComment(id);
        if(!deletedComment){
            throw new HttpError(404, "Comment not found");
        }
        res.status(200).json({message: "Coment deleted successfully"})
    }
}

export default CommentController;