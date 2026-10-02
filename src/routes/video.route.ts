import { Router } from "express";
import { z } from "zod";
import Container from '@/container'

const videoController = Container.getVideoController();
import * as videoSchema from "@/lib/zod.schemas/video.schema";
import * as baseSchema from "@/lib/zod.schemas/base.schema"
import auth from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate";
import { asyncHandler } from "@/lib/asyncHandler";

const router = Router()
const videoIdParamSchema = z.object({ id: baseSchema.idSchema })
const channelNameParamSchema = z.object({ name: baseSchema.nameSchema })


//GET
router.get( '/published', validate({ query: videoSchema.paginationAndOrderVideosSchema}), asyncHandler(videoController.getVideosPublished.bind(videoController)) )
router.get( '/get-video/:id', validate({params: videoIdParamSchema }), asyncHandler(videoController.getVideoById.bind(videoController)) )
router.get( '/channel/:name', auth(false), validate({ params: channelNameParamSchema, body: videoSchema.paginationAndOrderVideosSchema }), asyncHandler(videoController.getChannelVideos.bind(videoController)) )
router.get( '/search', validate({ body: videoSchema.searchVideoSchema }), asyncHandler(videoController.getVideosBySearch.bind(videoController)) )

//POST
router.post( '/', auth(), validate({body: videoSchema.createVideoSchema }), asyncHandler(videoController.createVideo.bind(videoController)) )
router.post( '/like/:id', auth(), validate( { params: videoIdParamSchema }), asyncHandler(videoController.updateLikeVideoStatus.bind(videoController)) )

//PUT
router.put( '/', auth(), validate( { body: videoSchema.updateVideoSchema}), asyncHandler(videoController.updateVideo.bind(videoController)) )

//DELETE
router.delete('/:id', validate({ params: videoIdParamSchema}), asyncHandler(videoController.deleteVideo.bind(videoController)))


export default router