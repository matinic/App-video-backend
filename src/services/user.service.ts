import { UserDto }   from "@/lib/zod/dto/user"
import { BaseDto } from "@/lib/zod/dto/base";
import { PrismaClient } from "@prisma/client"

export default class UserService {
    constructor(private prisma: PrismaClient){}
    async createUser( data: UserDto.CreateUserDto){
        return await this.prisma.user.create({ data: {
            ...data
        }});
    }
    async deleteUserById( { id }: BaseDto.IdDto){
        return await this.prisma.user.update({
            where: { id },
            data:{
                deleted: true
            }
        })
    }
    async getUserByNameOrEmail( data: string ){
        return await this.prisma.user.findFirst({
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
    }
    async checkUserEmail( { email }: BaseDto.EmailDto ){
        return await this.prisma.user.count({
            where:{
                email
            }
        })
    }
    async checkUserName ( { name }: BaseDto.NameDto ){
        return await this.prisma.user.count({
            where: {
                name,
            }
        })
    }
    async getChannelInfo( { name }: BaseDto.NameDto ){
        return await this.prisma.user.findUnique({
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
    }
    async getAuthChannelInfo( data: UserDto.AuthUserDto ){
        return await this.prisma.user.findUnique({
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
    }
    async updateRefreshToken({ userId, refreshToken }:UserDto.UpdateTokenDto){
        return await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken }   
        })
    }
    async createSubscription({ channelId, subscriberId }:UserDto.SubscriptionDto){ 
        return await this.prisma.channelSubscribers.create({
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
    }
    async deleteSubscription( { subscriberId, channelId }: UserDto.SubscriptionDto){
        await this.prisma.channelSubscribers.delete ({
            where:{
                channelId_subscriberId: {
                    channelId,
                    subscriberId
                }
            },
        })
    }
    async getSubscribers({ id, ...pagination }: UserDto.GetSubscribersListDto){
        return await this.prisma.channelSubscribers.findMany({
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
    }
    async getSubscriptions({ id, ...pagination }: UserDto.GetSubscribersListDto ){
        return await this.prisma.channelSubscribers.findMany({
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
    }
    async checkSubscription({ channelId, subscriberId }:UserDto.SubscriptionDto){
        return await this.prisma.user.count({
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




