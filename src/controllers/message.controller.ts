// src/controllers/message.controller.ts
import { Request, Response } from "express"
import MessageService from "@/services/message.service"
import { HttpError } from "@/lib/errors/http.error"

class MessageController {
    constructor(private messageService: MessageService) {}

    async createMessage(req: Request, res: Response) {
        const message = await this.messageService.createMessage(req.validatedBody)
        res.status(201).json({
            message: "Message created successfully",
            data: message
        })
    }

    async getMessageById(req: Request, res: Response) {
        const message = await this.messageService.getMessageById(req.validatedParams)
        if (!message) {
            throw new HttpError(404, "Message not found");
        }
        res.status(200).json({
            message: "Message retrieved successfully",
            data: message
        })
    }

    async updateMessage(req: Request, res: Response) {
        const { id } = req.user
        const message = await this.messageService.updateMessage({
            ...req.validatedBody,
            userId: id
        })
        res.status(200).json({
            message: "Message updated successfully",
            data: message
        })
    }

    async deleteMessage(req: Request, res: Response) {
        const { id } = req.user
        const message = await this.messageService.deleteMessage({
            ...req.validatedParams,
            userId: id
        })
        res.status(200).json({ message: "Message deleted successfully", data: message })
    }

    async getConversation(req: Request, res: Response) {
        const { contactId } = req.validatedParams
        const pagination = req.validatedQuery
        const messages = await this.messageService.getConversation({
            userId: req.user.id,
            contactId,
            ...pagination
        })
        const lastMessage = messages.at(-1)
        let cursor
        if (lastMessage) {
            cursor = {
                id: lastMessage.id,
                createdAt: lastMessage.createdAt
            }
        }
        res.status(200).json({
            message: "Conversation retrieved successfully",
            data: messages,
            cursor
        })
    }

    async getUserMessages(req: Request, res: Response) {
        const pagination = req.validatedQuery
        const messages = await this.messageService.getUserMessages({
            userId: req.user.id,
            ...pagination
        })
        const lastMessage = messages.at(-1)
        let cursor
        if (lastMessage) {
            cursor = {
                id: lastMessage.id,
                createdAt: lastMessage.createdAt
            }
        }
        res.status(200).json({
            message: "Messages retrieved successfully",
            data: messages,
            cursor
        })
    }

    async markMessageAsRead(req: Request, res: Response) {
        const { id } = req.user
        const { messageId } = req.validatedParams
        const message = await this.messageService.markAsRead({
            id: messageId,
            userId: id
        })
        res.status(200).json({
            message: "Message marked as read",
            data: message
        })
    }

    async getUnreadCount(req: Request, res: Response) {
        const { id } = req.user
        const count = await this.messageService.getUnreadCount(id)
        res.status(200).json({
            unreadCount: count
        })
    }
}

export default MessageController