import { NextFunction, Router } from "express";
import videoController from "@/controllers/video.controller";
import * as videoSchema from "@/utils/validations/video/schema";
import * as baseSchema from "@/utils/validations/base.schema"
import auth from "../utils/middlewares/auth.jwt"
import validate from "../utils/middlewares/validate/middleware";

const router = Router()


//GET
router.get( '/published', validate({ query: videoSchema.paginationAndOrderVideosSchema}), videoController.getVideosPublished )
router.get( '/get-video/:id', validate({params: baseSchema.idSchema}), videoController.getVideoById )
router.get( '/channel/:name', auth(false), validate({ params: baseSchema.nameSchema, body: videoSchema.paginationAndOrderVideosSchema }), videoController.getChannelVideos )
router.get( '/search', validate({ body: videoSchema.paginationAndOrderVideosSchema }), videoController.getVideosBySearch )

//POST
router.post( '/', auth(), validate({body: videoSchema.createVideoSchema }), videoController.createVideo )
router.post( '/like/:id', auth(), validate( { params: baseSchema.idSchema }), videoController.updateLikeVideoStatus )

//PUT
router.put( '/', auth(), validate( { body: videoSchema.updateVideoSchema}), videoController.updateVideo )

//DELETE
router.delete('/:id', validate({ params: baseSchema.idSchema}), videoController.deleteVideo)


export default router