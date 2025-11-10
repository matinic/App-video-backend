import { Request, Response } from "express";
import notificationService from "../services/notification.service";
import { NotificationDto } from "../utils/validations/notification/dto"
import { UserDto } from "../utils/validations/user/dto"
import commmentService  from "@/services/comment.service"

export default {
    createComment: async(req:Request,res:Response)=>{
        try {
            const body = req.body 
            const newCommentOnVideo = commmentService.
        } catch (error) {
            
        }
    },
    getComment: async(req:Request,res:Response)=>{
        
    },
    getCommentById: async(req:Request,res:Response)=>{

    },
    getAllVideoComments: async(req:Request,res:Response)=>{
            
    },
    updateComment: async(req:Request,res:Response)=>{

    },
    getCommentsFromVideo: async(req:Request,res:Response)=>{

    },
    getCommentsFromUser: async(req:Request,res:Response)=>{

    },
    getResponseFromComment: async(req:Request,res:Response)=>{

    },
    getCommentsByRating: async(req:Request,res:Response)=>{

    }
}