import { Request, Response } from "express";
import VideoService from "@/services/video.service";
import { HttpError } from "@/lib/errors/http.error";
import { NotificationEmitter } from "@/lib/notification/notification.emitter";
import { UserDto } from "@/lib/zod.schemas/user.schema";

export default class VideoController {
  constructor( private videoService: VideoService, private notificationEmitter: NotificationEmitter ){}
  
  async createVideo(req:Request, res:Response){
    const data = req.validatedBody
    const video = await this.videoService.createVideo(data)

    this.notificationEmitter.emit("videoUploaded", {
      authorUserId: video.authorId,
      authorUserName: video.author.name,
      videoId: video.id,
      videoThumbnail: video.thumbnail,
      videoTitle: video.title
    })

    res.status(201).json({message:"video created successfully"});
  }
  
  async getVideoById (req:Request, res:Response){
    const { id } = req.validatedParams
    const foundVideo = await this.videoService.getVideoById(id)
    if(!foundVideo){
      throw new HttpError(404, "Video not found");
    }
    res.status(200).json(foundVideo)
  }
  
  async getVideosPublished(req:Request, res:Response){ 
    const data = req.validatedQuery
    const videos = await this.videoService.getVideosPublished(data);
    res.status(200).json({
      videos,
      cursor: (data.skip ?? 0) + 1,
    });
  }
  
  async getVideosBySearch(req:Request, res:Response){
    const data = req.validatedBody 
    const videos = await this.videoService.searchVideo(data);
    res.status(200).json({
      videos,
      cursor: (data.skip ?? 0) + 1
    });
  }
  
  async getChannelVideos(req:Request, res:Response){ 
    const { name } = req.validatedParams 
    const data = req.validatedBody 
    const videos = await this.videoService.getChannelVideos({
      userName: name,
      ...data
    })
    res.status(200).json({
      videos,
      cursor: (data.skip ?? 0) + 1,
    })
  }
  
  async getChannelUnpublishedVideos(req:Request, res:Response){
    const { name } = req.user
    const data = req.validatedBody 
    const videos = await this.videoService.getChannelUnpublishedVideos({ 
      userName: name,
      ...data
    })
    res.status(200).json({
      videos,
      cursor: (data.skip ?? 0) + 1,
    })
  }
  
  async deleteVideo(req:Request, res:Response){
    const { id } = req.validatedParams 
    await this.videoService.deleteVideo(id)
    res.status(200).json({ message: "Video Deleted" })
  }
  
  async updateVideo(req:Request,res:Response){
    const data = req.validatedBody 
    const video = await this.videoService.updateVideo(data)
    res.status(200).json(video)
  }
  
  async updateLikeVideoStatus(req:Request, res:Response){
    const { id: videoId } = req.validatedParams
    const { id: userId } = req.user as UserDto.UserAuthDto
    await this.videoService.updateUserVideoStatus({ userId, videoId, isLike: true })
    res.status(200).json("Video likes status updated")
  }
  
  async getUserVideoStatus(req:Request, res:Response){
    const { id: userId } = req.user as UserDto.UserAuthDto
    const { videoId, isLike } = req.validatedBody
    const status = await this.videoService.getUserVideoStatus({ userId, videoId, isLike })
    if(!status) {
      throw new HttpError(400, "Relation not found");
    }
    res.status(200).json({ status })
  }
}
