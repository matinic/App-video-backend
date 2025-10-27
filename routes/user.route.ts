import { Router } from "express"
import userController from '@/controllers/user.controller'
import * as userSchema from "@/utils/validations/user/schema"
import * as baseSchema from "@/utils/validations/base.schema"
import auth from "@/utils/middlewares/auth.jwt"
import validate from "@/utils/middlewares/validate/middleware"

const router = Router()

//POST
router.post( "/create", validate(userSchema.createUserSchema,"body"), userController.createUser )
router.post( "/login", validate(userSchema.getSessionSchema,"body"), userController.getSession )
router.post( "/subscribe", auth(), validate(baseSchema.idSchema,"params"), userController.updateUserStatusSubscription)
router.post( "/refresh-auth", userController.updateRefreshToken)
router.post( "/cloudonary-signature", auth(false), userController.getCloudinarySignature)

//GET
router.get( "/channel/:name", validate(baseSchema.nameSchema,"params"), userController.getChannelInfo )
router.get( "/subscribers/:name", validate(baseSchema.paginationSchema, "query"), validate(baseSchema.nameSchema,"params"), userController.getSubscribers )
router.get( "/subscriptions", auth(), userController.getSubscriptions )
//DELETE
router.delete( "/delete", auth(), validate(baseSchema.idSchema,"body"), userController.deleteUser )

export default router



