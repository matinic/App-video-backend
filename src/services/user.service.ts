import { UserDto }   from "@/lib/zod.schemas/user.schema"
import { BaseDto } from "@/lib/zod.schemas/base.schema";
import { PrismaClient } from "@prisma/client"

export default class UserService {
    constructor(private prisma: PrismaClient){}
    async createUser( { userEmail, userName, userPassword }: UserDto.CreateUserDto){
        return await this.prisma.user.create({ data: {
            email: userEmail,
            name: userName,
            password: userPassword
        }});
    }
    async deleteUserById( userId: BaseDto.IdDto){
        return await this.prisma.user.update({
            where: { id: userId },
            data:{
                deleted: true
            }
        })
    }
    async getUserByNameOrEmail( data: BaseDto.EmailDto | BaseDto.NameDto ){
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
    async checkUserEmail( email: BaseDto.EmailDto ){
        return await this.prisma.user.findFirst({
            where:{
                email
            }
        })
    }
    async checkUserName ( name: BaseDto.NameDto ){
        return await this.prisma.user.findFirst({
            where: {
                name,
            }
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
    async getAuthUserInfo( { userId, userName }: UserDto.UserAuthDto ){
        return await this.prisma.user.findUnique({
            where: {
                id: userId,
                name: userName
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
    async createSubscription({ userFollowerId, userFollowingId }: UserDto.FollowDto ){ 
        return await this.prisma.userOnFollow.create({
            data:{
                followerUser: {
                    connect:{
                      id: userFollowerId
                    }
                },
                followingUser: {
                    connect: {
                        id: userFollowingId
                    }
                }
            }
        })
    }
    async unfollowUser( { userFollowingId, userFollowerId }: UserDto.FollowDto){
        await this.prisma.userOnFollow.delete ({
            where:{
                followerId_followingId:{
                    followerId: userFollowerId,
                    followingId: userFollowingId
                }
            },
        })
    }
    async getFollowers({ userId, ...pagination  }: UserDto.GetFollowsDto){
        return await this.prisma.userOnFollow.findMany({
            where:{ 
                followingId: userId 
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
    async getFollowings({ userId, ...pagination }: UserDto.GetFollowsDto ){
        return await this.prisma.userOnFollow.findMany({
            where:{ followerId: userId },
            select:{
                followingUser: {    
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
    async checkSubscription({ userFollowerId, userFollowingId }: UserDto.FollowDto){
        return await this.prisma.userOnFollow.findFirst({
            where: {
                followerId: userFollowerId,
                followingId: userFollowingId
            },
        })
    }
} 




