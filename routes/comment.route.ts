import { Router } from "express";
import commentController from "@/controllers/comment.controller";
import * as commentSchema from "@/utils/validations/comment/schema";
import * as baseSchema from "@/utils/validations/base.schema";
import auth  from "@/utils/middlewares/auth.jwt"
import validate from "@/utils/middlewares/validate/middleware";


const router = Router()
    
//POST
router.post( "/", validate( commentSchema.newCommentSchema, "body" ), commentController.createComment )

//GET 
router.get("/:id", commentController.getCommentById )

router.get("/all/video/:id", validate({ params: baseSchema.idSchema, query: baseSchema.paginationAndOrder }), commentController.getAllVideoComments)

router.get("/all/user/:id", validate({ params: baseSchema.idSchema } ), commentController.getAllUserComments)

//PUT 
router.put("/", auth(), validate( commentSchema.updateCommentSchema, "body" ), commentController.updateComment )

export default router