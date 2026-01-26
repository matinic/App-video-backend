import { NotificationDto }   from "../../utils/validations/notification/dto"
import { BaseDto } from "@/utils/validations/base.dto";
import notificationType from '@/utils/model.utils/notification/data'


const { notification, userNotification, user } = prismaInstance

export default {
    async createNewSubscriptionNotification({ userEmmiterId, userDestinationId }: NotificationDto.CreateNewSubscriptionNotificationDto){
        return await notification.create({
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
        return await notification.create({
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
        return await notification.create({
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
        return await notification.create({
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
        return await notification.create({
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
        return await userNotification.findMany({
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
        return await userNotification.count({
            where: {
                userDestinationId: id,
                read: false,
            },
        })
  },
  async updateNotification( { id }: BaseDto.IdDto ){
        return await userNotification.updateMany({
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
