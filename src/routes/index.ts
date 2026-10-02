import { Router } from "express"
import user from "./user.route"
import video from "./video.route"
import notification from "./notification.route"

const router = Router()


router.use("/user", user)
router.use("/video", video)
router.use("/notification", notification)

export default router