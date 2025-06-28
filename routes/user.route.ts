import { Router } from "express"
import userController from '../controllers/user.controller'
import userSchema from "../utils/zod/user/schema"
import { auth } from "../utils/middlewares/auth.jwt"
import validateZodSchema from "../utils/middlewares/validate.zod.schema"

// const {user,video,notification} = (require('../db/index.js')).models

const router = Router()
const { reqBody, reqParams, reqQuery } = validateZodSchema
const {userIdSchema} = userSchema

//POST
router.post("/", reqBody(userSchema.createUserSchema), userController.createUser )
router.post("/login", reqBody(userSchema.getSessionSchema), userController.getSession )
router.post("/subscription", auth, reqBody(userSchema.subscriptionSchema), userController.updateSubscription)
router.post("/refresh-auth", userController.updateRefreshToken)
router.post("/cloudonary-signature", auth, userController.getCloudinarySignature)

//GET
router.get( "/", reqQuery(userSchema.getUsersSchema), userController.getUsers )
router.get( "/getuser/:userId", reqParams(userIdSchema), userController.getUserById )

//DELETE
router.delete( "/deleteuser", auth, reqBody(userSchema.userIdSchema), userController.deleteUserById )

export default router



