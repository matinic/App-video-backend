import { Router } from "express";
import commentController from "@/controllers/comment.controller";
import * as commentSchema from "@/lib/zod/schemas/comment";
import * as baseSchema from "@/lib/zod/schemas/base";
import * as videoSchema from "@/lib/zod/schemas/video"
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