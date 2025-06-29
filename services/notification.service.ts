import { PrismaClient } from "../generated/prisma";
import { NotificationDto }   from "../utils/zod/notification/dto"
import { UserDto }  from "../utils/zod/user/dto"
import { NewNotificationInput } from "../utils/notifications.type/dto"

const prismaInstance = new PrismaClient()

const { notification, user } = prismaInstance
//Create another prisma client for a higher data access
// const { user, ...prismaB } = prisma.$extends()

export default {
   createNewVideoNotification: async(notificationData:NotificationDto.CreateNewVideoNotificationDto)=>{
    const newNotificationInput: NewNotificationInput = {
        userEmmiter: {
            connect: { id: notificationData.userId }
        },
        video: {
            connect: { id: notificationData.videoId }
        },
        notificationType: {
            connect: { type: "NEW-VIDEO"}
        } 
    }
    return await notification.create({
        data: newNotificationInput,
        include:{
            userEmmiter:{
                select:{
                    subscriptors:{
                        select:{
                            id: true
                        }
                    }
                }
            }
        }

    }) 
  },
  createNewCommentOnVideoNotification: async(notificationData:NotificationDto.CreateNewCommentOnVideoNotificationDto)=>{
    const newNotificationInput: NewNotificationInput = {
        userEmmiter: {
            connect: { id: notificationData.userId }
        },
        comment: {
            connect: { id: notificationData.commentId }
        },
        notificationType: {
            connect: { type: "NEW-COMMENT"}
        } 
    }
    return await notification.create({
        data: newNotificationInput,
        include:{
            userEmmiter:{
                include:{
                    comments:{
                        where:{
                            id: notificationData.commentId
                        },
                        include:{
                            video:{
                                select:{
                                    authorId: true
                                },
                            }
                        }
                    }
                }
            },
        },
    })
  },
  createNewCommentResponseNotification: async(notificationData:NotificationDto.CreateNewCommentResponseNotificationDto)=>{
    const newNotificationInput: NewNotificationInput = {
        userEmmiter: {
            connect: { id: notificationData.userId }
        },
        comment: {
            connect: { id: notificationData.responseId }
        },
        notificationType: {
            connect: { type: "NEW-COMMENT-RESPONSE"}
        } 
    }
    return await notification.create({
        data: newNotificationInput,
        include:{
            userEmmiter:{
                include:{
                    comments:{
                        where:{
                            id: notificationData.responseId
                        },
                        include:{
                            comment:{
                                select: {
                                    userId: true
                                },
                            }
                        }
                    }
                }
            }
        }
    })
  },
  createNewMessageNotification: async(notificationData:NotificationDto.CreateNewMessageNotificationDto)=>{
    const newNotificationInput: NewNotificationInput = {
        userEmmiter: {
            connect: { id: notificationData.userId }
        },
        message: {
            connect: { id: notificationData.messageId }
        },
        notificationType: {
            connect: { type: "NEW-MESSAGE" }
        } 
    }
    return await notification.create({
        data: newNotificationInput,
        include:{
            userEmmiter:{
                select:{
                    id: true,
                    image: true,
                    name: true
                },
                include:{
                    messagesSend:{
                        where:{
                            id: notificationData.messageId
                        },
                        select:{
                            receiverId: true
                        }
                    }
                }
            }
        }
    })
  },
  getNotification: async({ userId }:UserDto.UserIdDto)=>{
    return await notification.findMany({
        where:{
            userEmmiterId: userId,
            read: false
        },
        include:{
            userEmmiter: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            },
            notificationType: {
                select: {
                    type: true,
                    message: true
                }
            },
            video: {
                select: {
                    id: true,
                    title: true,
                    thumbnail: true
                }
            },
            comment: {
                select:{
                    id: true,
                    content: true
                }
            },
            message: {
                select:{
                    id: true,
                    content: true
                }
            },
        }
    })
  },
  getNotificationCount: async({ userId }:UserDto.UserIdDto)=>{
    return await user.findMany({
        where:{
            id: userId
        },
        include:{
            _count:{
                select:{
                    notifications: {
                        where:{ read: false }
                    }
                }
            }
        }
    })
  },
  updateNotification: async(updateNotificationData:NotificationDto.UpdateNotificationDto)=>{ 
    return await notification.update({
        where: {
            id:  updateNotificationData.notificationId,
        },
        data:{
            userDestination:{
                connect: updateNotificationData.userDestinationIdList
            }
        }
    })
  }
} 
