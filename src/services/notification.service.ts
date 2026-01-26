import { NotificationDto }   from "@/lib/validations/notification/dto"
import { BaseDto } from "@/lib/validations/base.dto";
import notificationType from '@/lib/notification/data'
import prisma from "@/lib/client"

export default {
    async createNewSubscriptionNotification({ userEmmiterId, userDestinationId }: NotificationDto.CreateNewSubscriptionNotificationDto){
        return await prisma.notification.create({
            data: {
                userEmmiter: {
                    connect: { id: userEmmiterId }
                },
                notificationType: {
                    connect: { type: notificationType["NEW-SUBSCRIPTION"].id }
                },
                destinations:{
                    create: { userDestinationId }
                }
            },
        })
    },
    async createNewVideoNotification({ userEmmiterId, videoId, userDestinationIdList }: NotificationDto.CreateNewVideoNotificationDto){
        return await prisma.notification.create({
            data:{
                userEmmiter: {
                    connect: { id: userEmmiterId }
                },
                video: {
                    connect: { id: videoId }
                },
                destinations:{
                    createMany: { data: userDestinationIdList }
                },
                notificationType: {
                    connect: { type: notificationType["NEW-VIDEO"].id}
                } 
            },
        }) 
    },
    async createNewCommentOnVideoNotification({ userEmmiterId, commentId, videoId, userDestinationId }: NotificationDto.CreateNewCommentOnVideoNotificationDto){
        return await prisma.notification.create({
            data:  {
                userEmmiter: {
                    connect: { id: userEmmiterId }
                },
                comment: {
                    connect: { id: commentId }
                },
                video:{
                    connect: { id: videoId }
                },
                destinations: {
                    create: { userDestinationId }
                },
                notificationType: {
                    connect: { type: notificationType["NEW-COMMENT"].id }
                } 
            },
        })
    },
    async createNewCommentResponseNotification({ userEmmiterId, responseId, userDestinationId }: NotificationDto.CreateNewCommentResponseNotificationDto){
        return await prisma.notification.create({
            data: {
                userEmmiter: {
                    connect: { id: userEmmiterId }
                },
                comment: {
                    connect: { id: responseId }
                },
                destinations:{
                    create:{ userDestinationId }
                },
                notificationType: {
                    connect: { type: notificationType["NEW-COMMENT-RESPONSE"].id }
                } 
            },
        })
    },
    async createNewMessageNotification({ userEmmiterId, messageId, userDestinationId }: NotificationDto.CreateNewMessageNotificationDto){
        return await prisma.notification.create({
            data: {
                userEmmiter: {
                    connect: { id: userEmmiterId }
                },
                message: {
                    connect: { id: messageId }
                },
                destinations: {
                    create: { userDestinationId }
                },
                notificationType: {
                    connect: { type: notificationType["NEW-MESSAGE"].id }
                } 
            }
        })
    },
    async getNotification( { id }: BaseDto.IdDto ){
        return await prisma.userNotification.findMany({
            where:{
                userDestinationId: id
            },
            include:{
                notification: {
                    select:{
                        createdAt: true
                    },
                    include:{
                        comment: {
                            select:{
                                id: true,
                                content: true,
                            }
                        },
                        message: {
                            select:{
                                id: true,
                                content: true
                            }
                        },
                        userEmmiter: {
                            select:{
                                id: true,
                                image: true,
                                name: true
                            }
                        },
                        video:{
                            select:{
                                id: true, 
                                title: true,
                                thumbnail: true
                            }
                        },
                        notificationType:{
                            select:{
                                message: true,
                                type: true
                            }
                        }
                    }
                }
            }
        })
  },
  async getNotificationCount({ id }: BaseDto.IdDto ){
        return await prisma.userNotification.count({
            where: {
                userDestinationId: id,
                read: false,
            },
        })
  },
  async updateNotification( { id }: BaseDto.IdDto ){
        return await prisma.userNotification.updateMany({
            where: {
                userDestinationId: id,
                read: false
            },
            data:{
                read: true
            }
        })
    },
}
