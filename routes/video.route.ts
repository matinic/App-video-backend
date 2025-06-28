import { NextFunction, Router } from "express";
import videoController from "../controllers/video.controller";
import videoSchema from "../utils/zod/video/schema";
import { auth } from "../utils/middlewares/auth.jwt"
import validateZodSchema from "../utils/middlewares/validate.zod.schema";


const router = Router()
const { reqBody, reqParams, reqQuery } = validateZodSchema

//GET
router.get( '/', reqQuery(videoSchema.getVideosSchema), videoController.getVideos )
router.get( '/getVideo/:videoId', reqParams(videoSchema.videoIdSchema), videoController.getVideoById )
router.get( '/author', reqQuery(videoSchema.getVideosByAuthorSchema), videoController.getVideosByAuthor )
router.get( '/search', reqQuery(videoSchema.getVideoBySearchQuerySchema), videoController.getVideosBySearch )

router.use( auth )
//POST
router.post( '/', reqBody( videoSchema.createVideoSchema ), videoController.createVideo )
router.post( '/like', reqBody( videoSchema.likeStatusSchema ), videoController.postLike )
router.post( '/dislike', reqBody( videoSchema.likeStatusSchema ), videoController.postDislike )

//PUT
router.put( '/', reqBody( videoSchema.updateVideoSchema ), videoController.updateVideo )

//DELETE
router.delete('/', reqBody(videoSchema.videoIdSchema), videoController.deleteVideo)


export default router