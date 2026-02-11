// src/routes/message.route.ts
import { Router } from "express"
import Container from "@/containerj"
import * as messageSchema from "@/lib/zod/schemas/message"
import * as baseSchema from "@/lib/zod/schemas/base"
import auth from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate"
import { asyncHandler } from "@/lib/asyncHandler"

const messageController = Container.getMessageController()
const router = Router()

// POST - Create a new message
router.post(
    "/create",
    auth(),
    validate({ body: messageSchema.createMessageSchema }),
    asyncHandler(messageController.createMessage.bind(messageController))
)

// GET - Get a message by ID
router.get(
    "/:id",
    validate({ params: baseSchema.idSchema }),
    asyncHandler(messageController.getMessageById.bind(messageController))
)

// GET - Get conversation between two users
router.get(
    "/conversation/:contactId",
    auth(),
    validate({ params: baseSchema.idSchema, query: baseSchema.paginationSchema }),
    asyncHandler(messageController.getConversation.bind(messageController))
)

// GET - Get all messages for a user
router.get(
    "/",
    auth(),
    validate({ query: baseSchema.paginationSchema }),
    asyncHandler(messageController.getUserMessages.bind(messageController))
)

// GET - Get unread count
router.get(
    "/count/unread",
    auth(),
    asyncHandler(messageController.getUnreadCount.bind(messageController))
)

// PUT - Update a message
router.put(
    "/update",
    auth(),
    validate({ body: messageSchema.updateMessageSchema }),
    asyncHandler(messageController.updateMessage.bind(messageController))
)

// PATCH - Mark message as read
router.patch(
    "/:messageId/read",
    auth(),
    validate({ params: baseSchema.idSchema }),
    asyncHandler(messageController.markMessageAsRead.bind(messageController))
)

// DELETE - Delete a message
router.delete(
    "/:id",
    auth(),
    validate({ params: baseSchema.idSchema }),
    asyncHandler(messageController.deleteMessage.bind(messageController))
)

export default router