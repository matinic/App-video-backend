import { Router } from "express";
import Container from "@/containerj";

const commentController = Container.getCommentController();
import * as commentSchema from "@/lib/zod/schemas/comment";
import * as baseSchema from "@/lib/zod/schemas/base";
import * as videoSchema from "@/lib/zod/schemas/video"
import auth  from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate";
import { asyncHandler } from "@/lib/asyncHandler";


const router = Router()
    
//POST
router.post( "/", validate({ body: commentSchema.newCommentSchema }), asyncHandler(commentController.createComment.bind(commentController)) )

//GET 
router.get("/video/:videoId", validate({ body: commentSchema.paginationAndOrderCommentSchema, query: videoSchema.videoIdSchema }), asyncHandler(commentController.getCommentsFromVideo.bind(commentController)))

router.get("/", auth(), asyncHandler(commentController.getCommentsFromUser.bind(commentController)))

//PUT 
router.put("/", auth(), validate({ body: commentSchema.updateCommentSchema }), asyncHandler(commentController.updateCommentById.bind(commentController)) )

//DELETE 
router.delete("/:id", auth(), validate({ params: baseSchema.idSchema }), asyncHandler(commentController.deleteComment.bind(commentController)))

export default router