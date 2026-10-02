import { Router } from "express";
import { z } from "zod";
import Container from '@/container'
import { markNotificationsAsReadRequestSchema } from "@/lib/zod.schemas/notification.schema";
import { idSchema, paginationSchema } from "@/lib/zod.schemas/base.schema";
import auth  from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate";

const notificationController = Container.getNotificationController()


const router = Router()

router.get(
	"/:id",
	auth(),
	validate({ params: z.object({ id: idSchema }) }),
	notificationController.getNotification.bind(notificationController),
)
router.patch(
	"/read",
	auth(),
	validate({ body: markNotificationsAsReadRequestSchema }),
	notificationController.updateBulkNotifications.bind(notificationController),
)
router.get(
	"/",
	auth(),
	validate({ query: paginationSchema }),
	notificationController.getNotifications.bind(notificationController),
)

export default router