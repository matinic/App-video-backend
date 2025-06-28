import { Request, Response } from "express";
import notificationService from "../services/notification.service";
import { NotificationDto } from "../utils/zod/notification/dto"
import { UserDto } from "../utils/zod/user/dto"

export default {
    createComment: async(req:Request,res:Response)=>{

    },
    createResponseComment: async(req:Request,res:Response)=>{
        
    },
    deleteCommentById: async(req:Request,res:Response)=>{

    },
    updateComment: async(req:Request,res:Response)=>{

    },
    getCommentById: async(req:Request,res:Response)=>{

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