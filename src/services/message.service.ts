// src/services/message.service.ts
import { MessageDto } from "@/lib/zod/dto/message"
import { BaseDto } from "@/lib/zod/dto/base"
import { PrismaClient } from "@prisma/client"
import { HttpError } from "@/lib/errors/http.error"

export default class MessageService {
    constructor(private prisma: PrismaClient) {}

    async createMessage({ content, senderId, receiverId }: MessageDto.CreateMessageDto) {
        return await this.prisma.message.create({
            data: {
                content,
                sender: {
                    connect: {
                        id: senderId
                    }
                },
                receiver: {
                    connect: {
                        id: receiverId
                    }
                }
            },
            select: {
                id: true,
                content: true,
                senderId: true,
                receiverId: true,
                isRead: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async getMessageById({ id }: BaseDto.IdDto) {
        const message = await this.prisma.message.findUnique({
            where: { id }
        })
        
        if (!message) {
            throw new HttpError(404, "Message not found")
        }
        
        if (message.isDeleted) {
            throw new HttpError(404, "Message not found")
        }

        return message
    }

    async updateMessage({ id, content, userId }: MessageDto.UpdateMessageDto & { userId: string }) {
        const message = await this.prisma.message.findUnique({ where: { id } })
        
        if (!message) {
            throw new HttpError(404, "Message not found")
        }
        
        if (message.isDeleted) {
            throw new HttpError(404, "Message not found")
        }
        
        // Solo el sender puede actualizar el mensaje
        if (message.senderId !== userId) {
            throw new HttpError(403, "You can only update your own messages")
        }

        return await this.prisma.message.update({
            where: { id },
            data: { content },
            select: {
                id: true,
                content: true,
                senderId: true,
                receiverId: true,
                isRead: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async deleteMessage({ id, userId }: BaseDto.IdDto & { userId: string }) {
        const message = await this.prisma.message.findUnique({ where: { id } })
        
        if (!message) {
            throw new HttpError(404, "Message not found")
        }
        
        if (message.isDeleted) {
            throw new HttpError(404, "Message not found")
        }
        
        // Solo sender o receiver pueden eliminar
        if (message.senderId !== userId && message.receiverId !== userId) {
            throw new HttpError(403, "You don't have permission to delete this message")
        }

        return await this.prisma.message.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            },
            select: {
                id: true,
                isDeleted: true,
                deletedAt: true
            }
        })
    }

    async markAsRead({ id, userId }: BaseDto.IdDto & { userId: string }) {
        const message = await this.prisma.message.findUnique({ where: { id } })
        
        if (!message) {
            throw new HttpError(404, "Message not found")
        }
        
        if (message.isDeleted) {
            throw new HttpError(404, "Message not found")
        }
        
        // Solo el receiver puede marcar como leído
        if (message.receiverId !== userId) {
            throw new HttpError(403, "You can only mark your received messages as read")
        }

        return await this.prisma.message.update({
            where: { id },
            data: { isRead: true },
            select: {
                id: true,
                isRead: true,
                updatedAt: true
            }
        })
    }

    async getConversation({ userId, contactId, ...pagination }: MessageDto.GetConversationDto) {
        return await this.prisma.message.findMany({
            where: {
                isDeleted: false,
                OR: [
                    {
                        senderId: userId,
                        receiverId: contactId
                    },
                    {
                        senderId: contactId,
                        receiverId: userId
                    }
                ]
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                content: true,
                senderId: true,
                receiverId: true,
                isRead: true,
                createdAt: true,
                updatedAt: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            ...pagination
        })
    }

    async getUserMessages({ userId, ...pagination }: MessageDto.GetUserMessagesDto) {
        return await this.prisma.message.findMany({
            where: {
                isDeleted: false,
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                content: true,
                senderId: true,
                receiverId: true,
                isRead: true,
                createdAt: true,
                updatedAt: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            ...pagination
        })
    }

    async getUnreadCount(userId: string) {
        return await this.prisma.message.count({
            where: {
                receiverId: userId,
                isRead: false,
                isDeleted: false
            }
        })
    }
}