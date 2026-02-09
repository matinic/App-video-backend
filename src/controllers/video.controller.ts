import { Request, Response } from "express";
import VideoService from "@/services/video.service";
import UserService from "@/services/user.service";
import NotificationService from "@/services/notification.service";
import { HttpError } from "@/lib/errors/http.error";

export default class VideoController {
  constructor(private userService: UserService, private videoService: VideoService, private notificationService: NotificationService ){}
  
  async createVideo(req:Request, res:Response){
    const data = req.validatedBody
    const { id } = req.user
    const createdVideo = await this.videoService.createVideo(data)

    const subscribers = await this.userService.getSubscribers({ id })
    const userDestinationIdList = subscribers.map( ( { subscriber })  => ({ userDestinationId: subscriber.id }))
    await this.notificationService.createNewVideoNotification({
      userEmmiterId: createdVideo.authorId,
      videoId: createdVideo.id,
      userDestinationIdList
    })

    res.status(201).json({message:"video created successfully"}).redirect(`/video/${createdVideo.id}`);
  }
  
  async getVideoById (req:Request, res:Response){
    const { id } = req.validatedParams
    const foundVideo = await this.videoService.getVideoById({ id })
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
      cursor: req.validatedQuery.skip + 1,
    });
  }
  
  async getVideosBySearch(req:Request, res:Response){
    const data = req.validatedBody 
    const videos = await this.videoService.getVideosBySearch(data);
    res.status(200).json({
      videos,
      cursor: req.validatedBody.skip + 1
    });
  }
  
  async getChannelVideos(req:Request, res:Response){ 
    const { name } = req.validatedParams 
    const data = req.validatedBody 
    const videos = await this.videoService.getChannelVideos({
      name,
      ...data
    })
    res.status(200).json({
      videos,
      cursor: req.validatedBody.skip + 1, 
    })
  }
  
  async getChannelUnpublishedVideos(req:Request, res:Response){
    const { name } = req.user
    const data = req.validatedBody 
    const videos = await this.videoService.getChannelUnpublishedVideos({ 
      name,
      ...data
    })
    res.status(200).json({
      videos,
      cursor: req.validatedBody.skip + 1, 
    })
  }
  
  async deleteVideo(req:Request, res:Response){
    const { id } = req.validatedParams 
    await this.videoService.deleteVideo( { id } )
    res.status(200).json({ message: "Video Deleted" })
  }
  
  async updateVideo(req:Request,res:Response){
    const data = req.validatedBody 
    const video = await this.videoService.updateVideo(data)
    res.status(200).json(video)
  }
  
  async updateLikeVideoStatus(req:Request, res:Response){
    const data = req.validatedParams
    await this.videoService.upsertUserVideoLikeStatus(data)
    res.status(200).json("Video likes status updated")
  }
  
  async getUserVideoStatus(req:Request, res:Response){
    const { id } = req.user
    const { videoId } = req.validatedBody
    const status = await this.videoService.getUserVideoStatus({ userId: id, videoId})
    if(!status) {
      throw new HttpError(400, "Relation not found");
    }
    res.status(200).json({ status })
  }
}
