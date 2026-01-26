import { Router } from "express"
import userController from '@/controllers/user.controller'
import * as userSchema from "@/utils/validations/user/schema"
import * as baseSchema from "@/utils/validations/base.schema"
import auth from "@/utils/middlewares/auth.jwt"
import validate from "@/utils/middlewares/validate/middleware"

const router = Router()

//POST
router.post( "/create", validate({ body: userSchema.createUserSchema }), userController.createUser )
router.post( "/login", validate({body: userSchema.getSessionSchema}), userController.getSession )
router.post( "/subscribe", auth(), validate({params: baseSchema.idSchema}), userController.updateUserStatusSubscription)
router.post( "/refresh-auth", userController.updateRefreshToken)
router.post( "/cloudonary-signature", auth(false), userController.getCloudinarySignature)

//GET
router.get( "/channel", validate({ query: baseSchema.nameSchema }), userController.getChannelInfo )
router.get( "/subscribers/:name", validate({ query: baseSchema.paginationSchema, params: baseSchema.nameSchema }), userController.getSubscribers )
router.get( "/subscriptions", auth(), userController.getSubscriptions )
//DELETE
router.delete( "/delete", auth(), validate({ body: baseSchema.idSchema }), userController.deleteUser )

export default router
