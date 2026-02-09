import { Router } from "express"
import Container from '@/containerj'

const userController = Container.getUserController()
import * as userSchema from "@/lib/zod/schemas/user"
import * as baseSchema from "@/lib/zod/schemas/base"
import auth from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate"
import { asyncHandler } from "@/lib/asyncHandler"

const router = Router()

//POST
router.post( "/create", validate({ body: userSchema.createUserSchema }), asyncHandler(userController.createUser.bind(userController)) )
router.post( "/login", validate({body: userSchema.getSessionSchema}), asyncHandler(userController.getSession.bind(userController)) )
router.post( "/subscribe", auth(), validate({params: baseSchema.idSchema}), asyncHandler(userController.updateUserStatusSubscription.bind(userController)))
router.post( "/refresh-auth", asyncHandler(userController.updateRefreshToken.bind(userController)))
router.post( "/cloudonary-signature", auth(false), asyncHandler(userController.getCloudinarySignature.bind(userController)))

//GET
router.get( "/channel", validate({ query: baseSchema.nameSchema }), asyncHandler(userController.getChannelInfo.bind(userController)) )
router.get( "/subscribers/:name", validate({ query: baseSchema.paginationSchema, params: baseSchema.nameSchema }), asyncHandler(userController.getSubscribers.bind(userController)) )
router.get( "/subscriptions", auth(), asyncHandler(userController.getSubscriptions.bind(userController)) )
//DELETE
router.delete( "/delete", auth(), validate({ body: baseSchema.idSchema }), asyncHandler(userController.deleteUser.bind(userController)) )

export default router
