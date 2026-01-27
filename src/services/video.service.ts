import { PrismaClient } from "@prisma/client";
import { VideoDto } from "@/lib/zod/dto/video";
import { BaseDto } from "@/lib/zod/dto/base"

export default class VideoService {
    constructor(private prisma:PrismaClient){}
    async createVideo( data:VideoDto.CreateVideoDto ){
        return await this.prisma.video.create({
            data:{
                author: {
                    connect: {
                        id: data.authorId
                    }
                },
                category: {
                    connect:{
                        id: data.categoryId
                    }
                },
                tags: {
                    connectOrCreate: data.tags?.map( tag => (
                        {where: { name: tag.name },  create: { name: tag.name }}
                    ))
                },
                title: data.title,
                url: data.title,
                description: data.description,
                thumbnail: data.thumbnail,
            }
        })
    }

    async getVideoById({ id }: BaseDto.IdDto){
        return await this.prisma.video.findUnique({where: { id }})
    }

    async getVideosPublished( { orderBy, ...pagination }: VideoDto.PaginationAndOrderVideosDto ){
        return await this.prisma.video.findMany({
            where:{
                published: true,
                deleted: false
            },
            orderBy,
            ...pagination,
        })
    }
    async getChannelVideos( { name, orderBy, ...pagination }: VideoDto.GetChannelVideosDto ){
        return await this.prisma.video.findMany({
            where:{
                author: { name },
                published: true,
            },
            orderBy,
            ...pagination
        })
    }
    async getChannelUnpublishedVideos( { name, orderBy, ...pagination }: VideoDto.GetChannelVideosDto ){
        return await this.prisma.video.findMany({
            where:{
                author: { name },
                published: false,
            },
            orderBy,
            ...pagination
        })
    }
    async getVideosBySearch( { keywords, filterParams,  orderBy, ...pagination }: VideoDto.GetVideosBySearchDto ){
        return await this.prisma.video.findMany({
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
                    {
                        ...(filterParams?.category && {category:{
                            name: filterParams.category
                        }}),
                        ...(filterParams?.rating && { rating: {
                            equals: filterParams.rating
                        }}),
                        ...(filterParams?.tags && { tags: {
                                some: {
                                    OR: filterParams.tags?.map( tag => ({
                                        name: tag.name
                                    }))
                                }  
                            }
                        })
                        
                    }
                ],
            },
            orderBy,
            ...pagination,
        });
    }

    async deleteVideo({ id }:BaseDto.IdDto){
        return await this.prisma.video.update({
            where: { id },
            data: { deleted: true }
        })
    }

    async updateVideoViews( id:string, views:number ){
        return await this.prisma.video.update({
            where: {id},
            data: { views }
        })
    }

    async updateVideo ({ videoId, ...videoData }:VideoDto.UpdateVideoDto){
        return await this.prisma.video.update({
            where: { id: videoId },
            data: videoData
        })
    }
    async upsertUserVideoLikeStatus({ userId, videoId, isLike }:VideoDto.VideoUserStatusDto){
        return await this.prisma.userVideoStatus.upsert({
            where:{
                videoId_userId:{
                    userId,
                    videoId
                }
            },
            create:{
                isLike,
                video:{
                    connect:{
                        id: videoId
                    }
                },
                user:{
                    connect:{
                        id: userId
                    } 
                }
            },
            update:{
                isLike
            }           
        })
    }
    async deleteUserVideoStatus({ userId, videoId }: VideoDto.VideoUserDto){
        return await this.prisma.userVideoStatus.delete({
            where:{
                videoId_userId:{
                    userId,
                    videoId
                }
            },
        })
    }
    async getEvaluatedVideos({ userId, videoId, isLike, ...pagination }: VideoDto.GetEvaluatedVideosWithPaginationDto ){
        return await this.prisma.userVideoStatus.findMany({
            where:{
                userId,
                isLike
            },
            include:{
                video: {
                    select:{
                        author:{
                            select: {
                                image: true,
                                name: true,
                                id: true
                            }
                        },
                        id: true,
                        url: true,
                        thumbnail: true
                        }
                    }
                },
                ...pagination
            })
    }
    async getUserVideoStatus({ userId, videoId }: VideoDto.VideoUserDto ){
        return await this.prisma.userVideoStatus.findUnique({
            where:{
                videoId_userId:{
                    userId,
                    videoId
                },
            },
            omit:{
                createdAt: true,
                updatedAt: true
            }
        })
    }
}


