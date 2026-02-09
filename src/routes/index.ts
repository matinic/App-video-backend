import { Router } from "express"
import user from "./user.route"
import video from "./video.route"
import notification from "./notification.route"
import message from "./message.route"
import comment from "./comment.route"

const router = Router()


router.use("/user", user)
router.use("/video", video)
router.use("/notification", notification)
router.use("/message", message)
router.use("/comment", comment)
router.get("/refresh")

export default router