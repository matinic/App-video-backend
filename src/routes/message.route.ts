// src/routes/message.route.ts
import { Router } from "express"
import Container from "@/containerj"
import * as messageSchema from "@/lib/zod/schemas/message"
import * as baseSchema from "@/lib/zod/schemas/base"
import auth from "@/lib/middlewares/auth.jwt"
import validate from "@/lib/middlewares/validate"

const messageController = Container.getMessageController()
const router = Router()

// POST - Create a new message
router.post(
    "/create",
    auth(),
    validate({ body: messageSchema.createMessageSchema }),
    messageController.createMessage.bind(messageController)
)

// GET - Get a message by ID
router.get(
    "/:id",
    validate({ params: baseSchema.idSchema }),
    messageController.getMessageById.bind(messageController)
)

// GET - Get conversation between two users
router.get(
    "/conversation/:contactId",
    auth(),
    validate({ params: baseSchema.idSchema, query: baseSchema.paginationSchema }),
    messageController.getConversation.bind(messageController)
)

// GET - Get all messages for a user
router.get(
    "/",
    auth(),
    validate({ query: baseSchema.paginationSchema }),
    messageController.getUserMessages.bind(messageController)
)

// PUT - Update a message
router.put(
    "/update",
    auth(),
    validate({ body: messageSchema.updateMessageSchema }),
    messageController.updateMessage.bind(messageController)
)

// DELETE - Delete a message
router.delete(
    "/:id",
    auth(),
    validate({ params: baseSchema.idSchema }),
    messageController.deleteMessage.bind(messageController)
)

export default router