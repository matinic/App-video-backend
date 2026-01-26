import { NextFunction, Router } from "express";
import videoController from "@/controllers/video.controller";
import * as videoSchema from "@/utils/validations/video/schema";
import * as baseSchema from "@/utils/validations/base.schema"
import auth from "../utils/middlewares/auth.jwt"
import validate from "../utils/middlewares/validate/middleware";

const router = Router()


//GET
router.get( '/published', validate(videoSchema.paginationAndOrderVideosSchema,"query"), videoController.getVideosPublished )
router.get( '/get-video/:id', validate(baseSchema.idSchema,"params"), videoController.getVideoById )
router.get( '/channel/:name', auth(false), validate(baseSchema.nameSchema,"params"), validate(videoSchema.paginationAndOrderVideosSchema,"body"), videoController.getChannelVideos )
router.get( '/search', validate(videoSchema.paginationAndOrderVideosSchema,"body"), videoController.getVideosBySearch )

//POST
router.post( '/', auth(), validate( videoSchema.createVideoSchema,"body"), videoController.createVideo )
router.post( '/like/:id', auth(), validate( baseSchema.idSchema,"params" ), videoController.updateLikeVideoStatus )

//PUT
router.put( '/', auth(), validate( videoSchema.updateVideoSchema, "body" ), videoController.updateVideo )

//DELETE
router.delete('/:id', validate( baseSchema.idSchema,"params"), videoController.deleteVideo)


export default router