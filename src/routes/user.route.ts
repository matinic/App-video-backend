import { Router } from "express"
import Container from '@/containerj'

const userController = Container.getUserController()
import * as userSchema from "@/lib/zod/schemas/user"
import * as baseSchema from "@/lib/zod/schemas/base"
import auth from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate"

const router = Router()

//POST
router.post( "/create", validate({ body: userSchema.createUserSchema }), userController.createUser.bind(userController) )
router.post( "/login", validate({body: userSchema.getSessionSchema}), userController.getSession.bind(userController) )
router.post( "/subscribe", auth(), validate({params: baseSchema.idSchema}), userController.updateUserStatusSubscription.bind(userController))
router.post( "/refresh-auth", userController.updateRefreshToken.bind(userController))
router.post( "/cloudonary-signature", auth(false), userController.getCloudinarySignature.bind(userController))

//GET
router.get( "/channel", validate({ query: baseSchema.nameSchema }), userController.getChannelInfo.bind(userController) )
router.get( "/subscribers/:name", validate({ query: baseSchema.paginationSchema, params: baseSchema.nameSchema }), userController.getSubscribers.bind(userController) )
router.get( "/subscriptions", auth(), userController.getSubscriptions.bind(userController) )
//DELETE
router.delete( "/delete", auth(), validate({ body: baseSchema.idSchema }), userController.deleteUser.bind(userController) )

export default router
