import { UserDto }   from "@/lib/validations/user/dto"
import { BaseDto } from "@/lib/validations/base.dto";
import prisma from "@/lib/client"

export default {
    async createUser( data: UserDto.CreateUserDto){
        return await prisma.user.create({ data: {
            ...data
        }});
    },
    async deleteUserById( { id }: BaseDto.IdDto){
        return await prisma.user.update({
            where: { id },
            data:{
                deleted: true
            }
        })
    },
    async getUserByNameOrEmail( data: string ){
        return await prisma.user.findFirst({
            where: {
                OR: [{ name: data }, { email: data }]
            },
            select: {
                password: true,
                id: true,
                name: true,
                refreshToken: true,
                image: true
            }
        }) 
    },
    async checkUserEmail( { email }: BaseDto.EmailDto ){
        return await prisma.user.count({
            where:{
                email
            }
        })
    },
    async checkUserName ( { name }: BaseDto.NameDto ){
        return await prisma.user.count({
            where: {
                name,
            }
        })
    },
    async getChannelInfo( { name }: BaseDto.NameDto ){
        return await prisma.user.findUnique({
            where: { name },
            select: {
                id: true,
                name: true,
                image: true,
                _count:{
                    select: {
                        subscribers: true,
                        videos: {
                            where: {
                                published: true
                            }
                        }
                    }
                },
                playlists: true,
            }
        })
    },
    async getAuthChannelInfo( data: UserDto.AuthUserDto ){
        return await prisma.user.findUnique({
            where: { ...data },
            select: {
                id: true,
                name: true,
                image: true,
                email: true,
                subscriptions: {
                    select: {
                       channel:{
                            select:{
                                id: true,
                                image: true,
                                name: true,
                            }
                       }
                    },
                    take: 12,
                },
                subscribers:{
                    select:{
                        subscriber:{
                            select:{
                                id: true,
                                image: true,
                                name: true
                            }
                        }
                    }
                },
                _count:{
                    select: {
                        subscribers: true,
                        subscriptions: true,                       
                        videos: true,
                        messagesReceive: true,
                        notifications: true,
                    }
                },
                playlists: true,
            }
        })
    },
    async updateRefreshToken({ userId, refreshToken }:UserDto.UpdateTokenDto){
        return await prisma.user.update({
            where: { id: userId },
            data: { refreshToken }   
        })
    },
    async createSubscription({ channelId, subscriberId }:UserDto.SubscriptionDto){ 
        return await prisma.channelSubscribers.create({
            data:{
                channel: {
                    connect:{
                      id: channelId
                    }
                },
                subscriber: {
                    connect: {
                        id: subscriberId
                    }
                }
            }
        })
    },
    async deleteSubscription( { subscriberId, channelId }: UserDto.SubscriptionDto){
        await prisma.channelSubscribers.delete ({
            where:{
                channelId_subscriberId: {
                    channelId,
                    subscriberId
                }
            },
        })
    },
    async getSubscribers({ id, ...pagination }: UserDto.GetSubscribersListDto){
        return await prisma.channelSubscribers.findMany({
            where:{ channelId: id },
            select:{
                subscriber: {
                    select: {
                        name: true,
                        image: true,
                        id: true
                    }
                },
            },
            ...pagination
        })
    },
    async getSubscriptions({ id, ...pagination }: UserDto.GetSubscribersListDto ){
        return await prisma.channelSubscribers.findMany({
            where:{ subscriberId: id },
            select:{
                channel:{    
                    select: {
                        name: true,
                        image: true,
                        id: true
                    }
                },
            },
            ...pagination
        })
    },
    async checkSubscription({ channelId, subscriberId }:UserDto.SubscriptionDto){
        return await prisma.user.count({
            where: {
                id: subscriberId,
                subscriptions:{
                    some:{
                        channelId
                    }
                }
            },
        })
    }
} 




