import { Router } from "express"
import user from "./user.route"
import video from "./video.route"

const router = Router()

router.use("/user", user)
router.use("/video", video)
router.get("/refresh")


module.exports = router