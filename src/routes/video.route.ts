import { NextFunction, Router } from "express";
import Container from '@/containerj'

const videoController = Container.getVideoController();
import * as videoSchema from "@/lib/zod/schemas/video";
import * as baseSchema from "@/lib/zod/schemas/base"
import auth from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate";

const router = Router()


//GET
router.get( '/published', validate({ query: videoSchema.paginationAndOrderVideosSchema}), videoController.getVideosPublished.bind(videoController) )
router.get( '/get-video/:id', validate({params: baseSchema.idSchema}), videoController.getVideoById.bind(videoController) )
router.get( '/channel/:name', auth(false), validate({ params: baseSchema.nameSchema, body: videoSchema.paginationAndOrderVideosSchema }), videoController.getChannelVideos.bind(videoController) )
router.get( '/search', validate({ body: videoSchema.paginationAndOrderVideosSchema }), videoController.getVideosBySearch.bind(videoController) )

//POST
router.post( '/', auth(), validate({body: videoSchema.createVideoSchema }), videoController.createVideo.bind(videoController) )
router.post( '/like/:id', auth(), validate( { params: baseSchema.idSchema }), videoController.updateLikeVideoStatus.bind(videoController) )

//PUT
router.put( '/', auth(), validate( { body: videoSchema.updateVideoSchema}), videoController.updateVideo.bind(videoController) )

//DELETE
router.delete('/:id', validate({ params: baseSchema.idSchema}), videoController.deleteVideo.bind(videoController))


export default router