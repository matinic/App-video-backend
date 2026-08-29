import { PrismaClient, PrismaPromise } from "@prisma/client";
import { VideoDto } from "@/lib/zod.schemas/video.schema";
import { BaseDto } from "@/lib/zod.schemas/base.schema"

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
                title: data.title,
                url: data.title,
                description: data.description,
                thumbnail: data.thumbnail,
            }
        })
    }

    async getVideoById( videoId: BaseDto.IdDto ){
        return await this.prisma.video.findUnique({where: { id: videoId }})
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
    async getChannelVideos( { userName, orderBy, ...pagination }: VideoDto.GetChannelVideosDto ){
        return await this.prisma.video.findMany({
            where:{
                author: {
                    name: userName
                },
                published: true,
            },
            orderBy,
            ...pagination
        })
    }
    async getChannelUnpublishedVideos( { userName, orderBy, ...pagination }: VideoDto.GetChannelVideosDto ){
        return await this.prisma.video.findMany({
            where:{
                author: {
                    name: userName
                 },
                published: false,
            },
            orderBy,
            ...pagination
        })
    }
    async searchVideo( { keywords,  orderBy, filterParams, ...pagination }: VideoDto.SearchVideoDto ){
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
                        ...(filterParams?.categoryName && { category:{
                            name: filterParams.categoryName
                        }}),
                        ...(filterParams?.ratingNumber && { rating: {
                            equals: filterParams.ratingNumber
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

    async deleteVideo( videoId: BaseDto.IdDto){
        return await this.prisma.video.update({
            where: { id:
                videoId
             },
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
    async updateUserVideoStatus({ userId, videoId, isLike }: VideoDto.UserVideoStatusDto ){
        const userVideoState = await this.prisma.userVideoStatus.findFirst({
            where:{
                userId,
                videoId                
            }
        })

        if(!userVideoState){
            return await this.prisma.userVideoStatus.create({
                data:{
                    isLike,
                    userId,
                    videoId
                }
            })
        }
        if(
            userVideoState.isLike && isLike ||
            !userVideoState.isLike && !isLike
        ){
            await this.prisma.userVideoStatus.delete({
                where:{
                    videoId_userId:{
                        userId,
                        videoId
                    }
                }
            })
            return null
        }else{
            return await this.prisma.userVideoStatus.update({
                where:{
                    videoId_userId:{
                        userId,
                        videoId
                    }
                },
                data:{
                    isLike
                }
            })
        }
    }

    async getUserVideoStatus({ userId, videoId, isLike }: VideoDto.UserVideoStatusDto ){
        return await this.prisma.userVideoStatus.findFirst({
            where:{
                userId,
                isLike
            }
        })
    }
}


