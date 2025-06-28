import { PrismaClient } from "../generated/prisma";
import { UserDto }   from "../utils/zod/user/dto"

const prismaInstance = new PrismaClient()

const { user, ...prisma } = prismaInstance.$extends({
    query: {
        user: {
                async findUnique({ model, operation, args, query }){
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
                    return query(args)
                },
                async findMany({ model, operation, args, query }){
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
                    return query(args) 
                },
                async findFirst({ model, operation, args, query }){
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
                    return query(args) 
                }
            }
        }
    },
);
//Create another prisma client for a higher data access
// const { user, ...prismaB } = prisma.$extends()

export default {
    createUser: async(data:UserDto.CreateUserDto) => {
        return await user.create({ data });
    },
    deleteUserById: async({ userId }:UserDto.UserIdDto) => {
        return await user.update({
            where: { id: userId },
            data:{
                deleted: true
            }
        })
    },
    getUserByNameOrEmail: async(data:string) => {
        return await user.findFirst({
            where: {
                OR: [{ name: data }, { email: data }]
            }
        }) 
    },
    getUserByEmail: async(email:UserDto.EmailDto) => {
        return await user.findUnique({where: { email }})
    },
    getUserById: async({ userId }:UserDto.UserIdDto) => {
        return await user.findUnique({where: { id: userId }})
    },
    getUserByName: async(name:UserDto.NameDto) => {
        return await user.findUnique({where: { name }})
    },
    getUsers: async(params:UserDto.GetUsersDto)=>{
        return await user.findMany({
            skip: params.amount * params.page,
            take: params.amount,
        })
    },
    updateRefreshToken: async({ userId, refreshToken }:UserDto.UpdateTokenDto)=>{
        return await user.update({
            where: { id: userId },
            data: { refreshToken }   
        })
    },
    createSubscription: async({ userId, channelId }:UserDto.SubscriptionDto) =>{ 
        await prisma.$transaction([
            user.update({
                where: {
                    id: userId,
                },
                data:{
                    subscriptions:{
                        connect: { id: channelId }
                    }
                }
            }),
            user.update({
                where:{
                    id: channelId
                },
                data:{
                    subscriptors:{
                        connect: { id: userId }
                    }
                }
            }) 
        ])
    },
    deleteSubscription: async({ userId, channelId }:UserDto.SubscriptionDto)=>{
        await prisma.$transaction([
            user.update({
                where:{
                    id: userId,
                },
                data:{
                    subscriptions:{
                        disconnect: { id: channelId }
                    }
                }
            }),
            user.update({
                where:{
                    id: channelId
                },
                data:{
                    subscriptors:{
                        disconnect: { id: userId }
                    }
                }
            })
        ])
    },
    getFollowedBy: async({ userId }:UserDto.UserIdDto)=>{
        return await user.findUnique({
            where:{ id: userId },
            include:{
                subscriptors: {
                    select:{
                        id: true,
                        name: true,
                        image: true,
                    }
                },
            }
        })
    },
    getFollowing: async({ userId }:UserDto.UserIdDto)=>{
        return await user.findUnique({
            where: { id: userId  },
            include:{
                subscriptors: {
                    select:{
                        id: true,
                        name: true,
                        image: true,
                    }
                },
            }
        })
    },
} 




