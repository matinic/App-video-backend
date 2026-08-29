import { UserDto }   from "@/lib/zod.schemas/user.schema"
import { BaseDto } from "@/lib/zod.schemas/base.schema";
import { PrismaClient } from "@prisma/client"

export default class UserService {
    constructor(private prisma: PrismaClient){}
    async createUser( { email, name, password }: UserDto.CreateUserDto){
        return await this.prisma.user.create({ data: {
            email,
            name,
            password
        }});
    }
    async findSessionUser( requiredData: string ){
        return await this.prisma.user.findFirst({
            where: {
                OR:[{
                    name: requiredData,
                },{
                    email: requiredData
                }]
            },
            select:{
                password: true,
                name: true,
                id: true,
                refreshToken: true,
                image: true
            }
        })
    }
    async getUser( user: UserDto.GetUserDto ){
        if(user.auth){
            return await this.prisma.user.findFirst({
                where:{
                    name: user.name,
                },
                select:{
                    image: true,
                    id: true,
                    name: true,
                    email: true
                }
            })
        }
        return await this.prisma.user.findFirst({
            where:{
                name: user.name
            },
            select:{
                image: true,
                name: true,
            },
        })

    }
    async getChannelInfo( name: BaseDto.NameDto ){
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
    async getAuthUserInfo( { id, name }: UserDto.UserAuthDto ){
        return await this.prisma.user.findUnique({
            where: {
                id,
                name
            },
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
                    subscriptions: true,                       
                    select: {
                        subscribers: true,
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
    async followChannel({ channelId, followerId }: UserDto.GetFollowStatusDto ){ 
        return await this.prisma.userOnFollow.create({
            data:{
                followerUser: {
                    connect:{
                      id: followerId
                    }
                },
                channel: {
                    connect: {
                        id: channelId
                    }
                }
            }
        })
    }
    async unfollowChannel( { channelId, followerId }: UserDto.GetFollowStatusDto){
        return await this.prisma.userOnFollow.delete ({
            where:{
                followerId_channelId:{
                    followerId,
                    channelId
                }
            },
        })
    }
    async getFollowers({ id, ...pagination  }: UserDto.GetFollowersDto){
        return await this.prisma.userOnFollow.findMany({
            where:{ 
                channelId: id
            },
            select:{
                followerUser: {
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
    async getChannelsFollowing({ id, ...pagination }: UserDto.GetChannelsFollowingDto ){
        return await this.prisma.userOnFollow.findMany({
            where:{ followerId: id },
            select:{
                channel: {    
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
    async getFollowStatus({ followerId, channelId }: UserDto.GetFollowStatusDto){
        return await this.prisma.userOnFollow.findFirst({
            where: {
               channelId,
               followerId
            },
        })
    }
    async deleteUser( id: BaseDto.IdDto ){
        const userSoftDeleted = await this.prisma.user.update({
            where:{
                id
            },
            data:{
                deleted: true
            }
        })
        if(!userSoftDeleted.deleted){
            return null
        }
        return 1
    }
} 




