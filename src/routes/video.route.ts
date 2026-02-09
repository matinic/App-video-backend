import { NextFunction, Router } from "express";
import Container from '@/containerj'

const videoController = Container.getVideoController();
import * as videoSchema from "@/lib/zod/schemas/video";
import * as baseSchema from "@/lib/zod/schemas/base"
import auth from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate";
import { asyncHandler } from "@/lib/asyncHandler";

const router = Router()


//GET
router.get( '/published', validate({ query: videoSchema.paginationAndOrderVideosSchema}), asyncHandler(videoController.getVideosPublished.bind(videoController)) )
router.get( '/get-video/:id', validate({params: baseSchema.idSchema}), asyncHandler(videoController.getVideoById.bind(videoController)) )
router.get( '/channel/:name', auth(false), validate({ params: baseSchema.nameSchema, body: videoSchema.paginationAndOrderVideosSchema }), asyncHandler(videoController.getChannelVideos.bind(videoController)) )
router.get( '/search', validate({ body: videoSchema.paginationAndOrderVideosSchema }), asyncHandler(videoController.getVideosBySearch.bind(videoController)) )

//POST
router.post( '/', auth(), validate({body: videoSchema.createVideoSchema }), asyncHandler(videoController.createVideo.bind(videoController)) )
router.post( '/like/:id', auth(), validate( { params: baseSchema.idSchema }), asyncHandler(videoController.updateLikeVideoStatus.bind(videoController)) )

//PUT
router.put( '/', auth(), validate( { body: videoSchema.updateVideoSchema}), asyncHandler(videoController.updateVideo.bind(videoController)) )

//DELETE
router.delete('/:id', validate({ params: baseSchema.idSchema}), asyncHandler(videoController.deleteVideo.bind(videoController)))


export default router