// src/controllers/message.controller.ts
import { Request, Response } from "express"
import MessageService from "@/services/message.service"

class MessageController {
    constructor(private messageService: MessageService) {}

    async createMessage(req: Request, res: Response) {
        try {
            const message = await this.messageService.createMessage(req.validatedBody)
            res.status(201).json({
                message: "Message created successfully",
                data: message
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message })
            }
        }
    }

    async getMessageById(req: Request, res: Response) {
        try {
            const message = await this.messageService.getMessageById(req.validatedParams)
            if (!message) {
                res.status(404).json({ message: "Message not found" })
                return
            }
            res.status(200).json({
                message: "Message retrieved successfully",
                data: message
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message })
            }
        }
    }

    async updateMessage(req: Request, res: Response) {
        try {
            const message = await this.messageService.updateMessage(req.validatedBody)
            if (!message) {
                res.status(404).json({ message: "Message not found" })
                return
            }
            res.status(200).json({
                message: "Message updated successfully",
                data: message
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message })
            }
        }
    }

    async deleteMessage(req: Request, res: Response) {
        try {
            const message = await this.messageService.deleteMessage(req.validatedParams)
            if (!message) {
                res.status(404).json({ message: "Message not found" })
                return
            }
            res.status(200).json({ message: "Message deleted successfully" })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message })
            }
        }
    }

    async getConversation(req: Request, res: Response) {
        try {
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
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message })
            }
        }
    }

    async getUserMessages(req: Request, res: Response) {
        try {
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
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message })
            }
        }
    }
}

export default MessageController