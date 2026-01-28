import { Request, Response } from "express";
import VideoService from "@/services/video.service";
import UserService from "@/services/user.service";
import NotificationService from "@/services/notification.service";

export default class VideoController {
  constructor(private userService: UserService, private videoService: VideoService, private notificationService: NotificationService ){}
  async createVideo(req:Request, res:Response){
    try {
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
      return
    }catch (err) {
      if(err instanceof Error){
        res.status(500).json({message: "Something wrong happend while uploading the video"})
        console.log(err.message)
      }
    }
  }
  async getVideoById (req:Request, res:Response){
    try {
      const { id } = req.validatedParams
      const foundVideo = await this.videoService.getVideoById({ id })
      if(!foundVideo){
        res.status(404).json({message: "Video not found"})
        return;
      }
      res.status(200).json(foundVideo)
      return
    }catch (err) {
      if(err instanceof Error){
          res.status(500).json({ message: "Server Error" })
          console.log(err.message)
      }
    }
  }
  async getVideosPublished(req:Request, res:Response){ 
    try { 
      const data = req.validatedQuery
      const videos = await this.videoService.getVideosPublished(data);
      res.status(200).json({
        videos,
        cursor: req.validatedQuery.skip + 1,
      });
      return
    } catch ( err ) {
      console.log(err)
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "Server Error"})
        return 
      }
    }
  }
  async getVideosBySearch(req:Request, res:Response){
    try {
      const data = req.validatedBody 
      const videos = await this.videoService.getVideosBySearch(data);
      res.status(200).json({
        videos,
        cursor: req.validatedBody.skip + 1
      });
    } catch (error) { 
       if(error instanceof Error){
        res.status(500).json({message: "Server Error"})
        console.log(error.message)
      }
    }
  }
  async getChannelVideos(req:Request, res:Response){ 
    try {
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
      return 
    } catch (error) {
       if(error instanceof Error){
        res.status(500).json({message: "Server Error"})
        console.log(error.message)
      }
    }
  }
  async getChannelUnpublishedVideos(req:Request, res:Response){
    try {
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
      return 
    } catch (error) {
       if(error instanceof Error){
        res.status(500).json({message: "Server Error"})
        console.log(error.message)
      }
    }
  }
  async deleteVideo(req:Request, res:Response){
    try {
      const { id } = req.validatedParams 
      await this.videoService.deleteVideo( { id } )
      res.status(200).json({ message: "Video Deleted" })
      return 
    } catch (err) {
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "Something wrong happend while deleting the video"})
        return;
      }
    }
  }
  async updateVideo(req:Request,res:Response){
    try {
      const data = req.validatedBody 
      const video = await this.videoService.updateVideo(data)
      res.status(200).json(video)
      return 
    } catch (error) {
      if(error instanceof Error){
        console.log(error.message)
        res.status(500).json({message: "Something wrong happend while updating the video"})
        return;
      }      
    }
  }
  async updateLikeVideoStatus(req:Request, res:Response){
    try {
      const data = req.validatedParams
      await this.videoService.upsertUserVideoLikeStatus(data)
      res.status(200).json("Video likes status updated")
      return
    } catch (err) {
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "Something wrong happend while updating the video"})
        return;
      }
    }
  }
  async getUserVideoStatus(req:Request, res:Response){
    try {
      const { id } = req.user
      const { videoId } = req.validatedBody
      const status = await this.videoService.getUserVideoStatus({ userId: id, videoId})
      if(!status) {
        res.status(400).json({ message: "Relation not found"})
        return
      }
      res.status(200).json({ status })
      return
    } catch (err) {
        if(err instanceof Error){
          console.log(err.message)
          res.status(500).json({message: "Something wrong happend while updating the video"})
          return;
      }
    }
  }

}
