// src/services/message.service.ts
import { MessageDto } from "@/lib/zod/dto/message"
import { BaseDto } from "@/lib/zod/dto/base"
import { PrismaClient } from "@prisma/client"

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
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async getMessageById({ id }: BaseDto.IdDto) {
        return await this.prisma.message.findUnique({
            where: { id },
            select: {
                id: true,
                content: true,
                senderId: true,
                receiverId: true,
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
            }
        })
    }

    async updateMessage({ id, content }: MessageDto.UpdateMessageDto) {
        return await this.prisma.message.update({
            where: { id },
            data: { content },
            select: {
                id: true,
                content: true,
                senderId: true,
                receiverId: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async deleteMessage({ id }: BaseDto.IdDto) {
        return await this.prisma.message.delete({
            where: { id }
        })
    }

    async getConversation({ userId, contactId, ...pagination }: MessageDto.GetConversationDto) {
        return await this.prisma.message.findMany({
            where: {
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
}