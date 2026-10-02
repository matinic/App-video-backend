import { Router } from "express"
import { z } from "zod"
import Container from '@/container'

const userController = Container.getUserController()
import * as userSchema from "@/lib/zod.schemas/user.schema"
import * as baseSchema from "@/lib/zod.schemas/base.schema"
import auth from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate"
import { asyncHandler } from "@/lib/asyncHandler"

const router = Router()
const channelNameParamSchema = z.object({ name: baseSchema.nameSchema })
const channelNameQuerySchema = z.object({ name: baseSchema.nameSchema })
const channelIdParamSchema = z.object({ id: baseSchema.idSchema })

//POST
router.post( "/create", validate({ body: userSchema.createUserSchema }), asyncHandler(userController.createUser.bind(userController)) )
router.post( "/login", validate({body: userSchema.getUserSessionSchema}), asyncHandler(userController.getSession.bind(userController)) )
router.post( "/subscribe/:id", auth(), validate({ params: channelIdParamSchema }), asyncHandler(userController.updateFollowStatus.bind(userController)))
router.post( "/refresh-auth", asyncHandler(userController.updateRefreshToken.bind(userController)))
router.post( "/cloudonary-signature", auth(false), asyncHandler(userController.getCloudinarySignature.bind(userController)))

//GET
router.get( "/channel", validate({ query: channelNameQuerySchema }), asyncHandler(userController.getChannelInfo.bind(userController)) )
router.get( "/subscribers/:name", validate({ query: baseSchema.paginationSchema, params: channelNameParamSchema }), asyncHandler(userController.getSubscribers.bind(userController)) )
router.get( "/subscriptions", auth(), validate({ query: userSchema.getChannelsFollowingSchema.pick({ take: true, skip: true }) }), asyncHandler(userController.getChannelsFollowing.bind(userController)) )
router.get( "/subscribe/:id", auth(), validate({ params: channelIdParamSchema }), asyncHandler(userController.checkFollowing.bind(userController)) )
//DELETE
router.delete( "/delete", auth(), asyncHandler(userController.deleteUser.bind(userController)) )

export default router
