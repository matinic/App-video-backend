import { Operation } from "@prisma/client/runtime/library";
import { PrismaClient, Prisma } from "@/generated/prisma";
import { UserDto }   from "../utils/validations/user/dto"
import { BaseDto } from "@/utils/validations/base.dto";

const prismaDefineExtension = Prisma.defineExtension({
    name: "user.service PrismaClient extension",
    model:{
        user:{
            selectDataUser<T extends Operation>(
                args: Prisma.Args<typeof user,  T> 
            ){
                args = {
                        ...args,
                        where:{ ...args.where, deleted: false },
                        select: {
                            ...args.select,
                            id: true,
                            name: true,
                            image: true,
                        } 
                    }
                return args
            }
        }
    }
})
const prismaClient = new PrismaClient()

const prismExtendedA = prismaClient.$extends(prismaDefineExtension)

const { user, channelSubscribers, ...prisma } = prismExtendedA.$extends({
    query: {
        user: {
                async findUnique({ model, operation, args, query }){
                    const userQueryArgs = user.selectDataUser<typeof operation>(args)
                    args = userQueryArgs
                    return query(args) 
                },
                async findMany({ model, operation, args, query }){
                    const userQueryArgs = user.selectDataUser<typeof operation>(args)
                    args = userQueryArgs
                    return query(args) 
                },
                async findFirst({ model, operation, args, query }){
                    const userQueryArgs = user.selectDataUser<typeof operation>(args)
                    args = userQueryArgs
                    return query(args) 
                }
            }
        }
    },
);

export default {
    async createUser( data: UserDto.CreateUserDto){
        return await user.create({ data: {
            ...data
        }});
    },
    async deleteUserById( { id }: BaseDto.IdDto){
        return await user.update({
            where: { id },
            data:{
                deleted: true
            }
        })
    },
    async getUserByNameOrEmail( data: string ){
        return await user.findFirst({
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
        return await user.count({
            where:{
                email
            }
        })
    },
    async checkUserName ( { name }: BaseDto.NameDto ){
        return await user.count({
            where: {
                name,
            }
        })
    },
    async getChannelInfo( { name }: BaseDto.NameDto ){
        return await user.findUnique({
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
        return await user.findUnique({
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
        return await user.update({
            where: { id: userId },
            data: { refreshToken }   
        })
    },
    async createSubscription({ channelId, subscriberId }:UserDto.SubscriptionDto){ 
        return await channelSubscribers.create({
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
        await channelSubscribers.delete ({
            where:{
                channelId_subscriberId: {
                    channelId,
                    subscriberId
                }
            },
        })
    },
    async getSubscribers({ id, ...pagination }: UserDto.GetSubscribersListDto){
        return await channelSubscribers.findMany({
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
        return await channelSubscribers.findMany({
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
        return await user.count({
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




