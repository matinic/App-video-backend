import { Router } from "express";
import commentController from "@/controllers/comment.controller";
import * as commentSchema from "@/lib/validations/comment/schema";
import * as baseSchema from "@/lib/validations/base.schema";
import * as videoSchema from "@/lib/validations/video/schema"
import auth  from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate/middleware";


const router = Router()
    
//POST
router.post( "/", validate({ body: commentSchema.newCommentSchema }), commentController.createComment )

//GET 
router.get("/video/:videoId", validate({ body: commentSchema.paginationAndOrderCommentSchema, query: videoSchema.videoIdSchema }), commentController.getCommentsFromVideo)

router.get("/", auth(), commentController.getCommentsFromUser)

//PUT 
router.put("/", auth(), validate({ body: commentSchema.updateCommentSchema }), commentController.updateCommentById )

//DELETE 
router.delete("/:id", auth(), validate({ params: baseSchema.idSchema }))

export default router