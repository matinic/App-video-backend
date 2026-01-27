import { Request, Response } from "express";
import CommentService from "@/services/comment.service"

class CommentController {
    constructor(private commentService: CommentService) {}

    async createComment(req:Request,res:Response){
        try {
            await this.commentService.createComment(req.validatedBody);
            res.status(200).json({message: "Comment Created"})
        } catch (error) {
            if(error instanceof Error){
                res.status(500).json({ message: "Server Error" })
                console.log(error.message)
            }
        }
    }

    async getCommentsFromVideo(req:Request,res:Response){
      try{
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
        return
      }catch(error){
        if(error instanceof Error){
            res.status(500).json({ message: "Server Error" })
            console.log(error.message)
        }
      }
    }

    async getCommentsFromUser(req:Request,res:Response){
        try{
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
                return
            }
            res.status(200).json({
                commentsFound,
                cursor
            })
        }catch(error){
            if(error instanceof Error){
                res.status(500).json({ message: "Server Error" })
                console.log(error.message)
            }
        }
    }

    async updateCommentById(req:Request, res:Response){
        try {
            const updatedComment = await this.commentService.updateComment(req.validatedBody);
            if(!updatedComment) res.status(404).json({message: "Comment not found"});
            res.status(200).json({
                message: "comment updated successfully"
            })
        } catch (error) {
            if(error instanceof Error){
                res.status(500).json({ message: "Server Error" })
                console.log(error.message)
            }
        }
    }

    async deleteComment(req:Request, res:Response){
        try {
            const { id } = req.validatedParams;
            const deletedComment = await this.commentService.deleteComment(id);
            if(!deletedComment){
                res.status(404).json({message: "Comment not found"});
                return
            }
            res.status(200).json({message: "Coment deleted successfully"})
            return
        } catch (error) {
            if(error instanceof Error){
                res.status(500).json({ message: "Server Error" })
                console.log(error.message)
            }
        }
    }
}

export default CommentController;