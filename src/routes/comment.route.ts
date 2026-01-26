import { Router } from "express";
import commentController from "@/controllers/comment.controller";
import * as commentSchema from "@/utils/validations/comment/schema";
import * as baseSchema from "@/utils/validations/base.schema";
import * as videoSchema from "@/utils/validations/video/schema"
import auth  from "@/utils/middlewares/auth.jwt"
import validate from "@/utils/middlewares/validate/middleware";


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