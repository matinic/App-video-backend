import { PrismaClient } from "../generated/prisma";
import { NotificationDto }   from "../utils/zod/notification/dto"
import { UserDto }   from "../utils/zod/user/dto"
import notificationType from "../utils/notifications.type/data.json"

const prismaInstance = new PrismaClient()

const { notification, user } = prismaInstance
//Create another prisma client for a higher data access
// const { user, ...prismaB } = prisma.$extends()

export default {
   createVideoNotification: async(notificationData:NotificationDto.CreateVideoNotificationDto)=>{
    return await notification.create({
        data:{
            userEmmiterId: notificationData.userId,
            videoId: notificationData.videoId,
            notificationTypeType: notificationType["NEW-VIDEO"].type
        },
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
  createCommentOnVideoNotification: async(notificationData:NotificationDto.CreateCommentNotificationDto)=>{
    return await notification.create({
        data:{
            userEmmiterId: notificationData.userId,
            commentId: notificationData.commentId,
            notificationTypeType: notificationType["NEW-COMMENT"].type
        },
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
  createCommentResponseNotification: async(notificationData:NotificationDto.CreateResponseNotificationDto)=>{
    return await notification.create({
        data:{
            userEmmiterId: notificationData.userId,
            commentId: notificationData.responseId,
            notificationTypeType: notificationType["RESPONSE-COMMENT"].type
        },
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
  createMessageNotification: async(notificationData:NotificationDto.CreateMessageNotificationDto)=>{
    return await notification.create({
        data:{
            userEmmiterId: notificationData.userId,
            commentId: notificationData.messageId,
            notificationTypeType: notificationType["NEW-MESSAGE"].type
        },
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
