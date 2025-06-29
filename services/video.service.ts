import { PrismaClient, Video, User, Prisma } from "../generated/prisma";
import { VideoDto } from "../utils/zod/video/dto";

const  { video, user, ...prisma } = new PrismaClient().$extends({
    query:{
        video:{
            async findUnique({ model, operation, args, query }){
                args = {
                    ...args,
                    where:{ ...args.where, deleted: false },
                    select: {
                        ...args.select,
                        id: true,
                        title: true,
                        description: true,
                        url: true,
                        thumbnail: true,
                        views: true,
                    }
                }
                return query(args)
            },
            async update({args, query}){
                args = {
                    ...args,
                    where: {
                        ...args.where,
                        deleted: false
                    }
                }
                return query(args)
            }
    }    
}});

export default {   
    createVideo: async( data:VideoDto.CreateVideoDto ) => {
        return await video.create({
             data: {
                ...data,
                authorId: data.userId
             }
        })
    },
    getAllVideosFromUser: async(authorId:string) => {
            return await video.findMany({where: { authorId }})
        },
    getVideoById: async({ videoId }:VideoDto.VideoIdDto) => {
            return await video.findUnique({where: { id: videoId }})
        },
    getVideoByTitle: async(title:string) => {
            return await video.findFirst( { where: { title }})
    } ,  
    getVideosPaginated: async(amount:number,page:number) => {
            return await video.findMany({
                skip: amount * page,
                take: amount,                
            })
        } , 
    getPublishedVideosPaginated: async(data:VideoDto.GetVideosDto)=>{
            return await video.findMany({
                where:{
                    published: true,
                },
                take: data.amount,
                skip: data.amount * data.page,
                orderBy: {
                    title: data.orderBy
                }
            })
        },
    getVideosByAuthor: async(data:VideoDto.GetVideoByAuthorDto)=>{
        return await video.findMany({
                where:{
                    id: data.authorId,
                    published: true,
                },
                take: data.amount,
                skip: data.amount * data.page,
                orderBy: {
                    title: data.orderBy
                }
        })
    },
    getVideosBySearch: async (keywords: string[], filterQuery?: string | null) => {
        return await video.findMany({
            where: {
            AND: [
                    {
                        OR: keywords.map((word) => ({
                                title: {
                                contains: word,
                                mode: 'insensitive', // para hacer búsqueda sin distinguir mayúsculas
                            },
                        })),
                    },
                    ...(filterQuery ? [{ category: filterQuery }] : []), // ejemplo con filtro
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    },
    getVidosByTitle: async(title:string)=>{
            return await video.findMany({where: { title }})
        },
    deleteVideo: async({ videoId }:VideoDto.VideoIdDto) => {
        return await video.update({
            where: { id: videoId },
            data: { deleted: true }
        })
    },
    updateVideoViews: async(id:string,views:number)=>{
        return await video.update({
            where: {id},
            data: { views }
        })
    },
    updateVideo: async({ videoId, ...videoData }:VideoDto.UpdateVideoDto)=>{
        return await video.update({
            where: { id: videoId },
            data: videoData
        })
    },
    getVideoIfUserAlreadyLiked: async({ userId,videoId }:VideoDto.LikeStatusDto)=>{
        return await video.findUnique({
            where: { 
                id: videoId,
                likes: {
                   some: {
                    id: userId
                   }
                }
            },
        })    
    },
    getVideoIfUserAlreadyDisliked: async({ userId,videoId }:VideoDto.LikeStatusDto)=>{
        return await video.findUnique({
            where: { 
                id: videoId,
                dislikes: {
                   some: {
                    id: userId
                   }
                }
            },
        })    
    },
    createVideoLike: async ({ videoId, userId }:VideoDto.LikeStatusDto )=> {
        return await video.update({
            where: { id: videoId },
            data: {
                likes:{
                    connect: { id: userId }
                }
            }
        })
    },
    deleteVideoLike:async ({ videoId, userId }:VideoDto.LikeStatusDto)=> {
        return await video.update({
            where: { id: videoId },
            data: {
                likes:{
                    disconnect: { id: userId }
                }
            }
        })
    },
    createVideoDislike: async({ videoId, userId }:VideoDto.LikeStatusDto)=>{
        return await video.update({
            where: { id: videoId },
            data: {
                dislikes:{
                    connect: { id: userId }
                }
            }
        })
    },
    deleteVideoDislike: async({ videoId, userId }:VideoDto.LikeStatusDto)=>{
        return await video.update({
            where: { id: videoId },
            data: {
                dislikes:{
                    disconnect: { id: userId }
                }
            }
        })
    },
    
    
   
}

