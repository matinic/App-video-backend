import { Request, Response } from "express";
import videoService  from "../src/services/video.service";
import notificationService from "@/src/services/notification.service"
import userService from "@/src/services/user.service";

export default {
  async createVideo(req:Request, res:Response){
    try {
      const data = req.body
      const { id } = req.user
      const createdVideo = await videoService.createVideo(data)

      const subscribers = await userService.getSubscribers({ id })
      const userDestinationIdList = subscribers.map( ( { subscriber })  => ({ userDestinationId: subscriber.id }))
      await notificationService.createNewVideoNotification({
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
  },
  async getVideoById (req:Request, res:Response){
    try {
      const { id } = req.params
      const foundVideo = await videoService.getVideoById({ id })
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
  },
  async getVideosPublished(req:Request, res:Response){ 
    try { 
      const data = req.body
      const videos = await videoService.getVideosPublished(data);
      res.status(200).json({
        videos,
        cursor: req.body.skip + 1,
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
  },
  async getVideosBySearch(req:Request, res:Response){
    try {
      const data = req.validatedQuery 
      const videos = await videoService.getVideosBySearch(data);
      res.status(200).json({
        videos,
        cursor: req.body.skip + 1
      });
    } catch (error) { 
       if(error instanceof Error){
        res.status(500).json({message: "Server Error"})
        console.log(error.message)
      }
    }
  },
  async getChannelVideos(req:Request, res:Response){ 
    try {
      const { name } = req.params 
      const data = req.body 
      const videos = await videoService.getChannelVideos({
        name,
        ...data
      })
      res.status(200).json({
        videos,
        cursor: req.body.skip + 1, 
      })
      return 
    } catch (error) {
       if(error instanceof Error){
        res.status(500).json({message: "Server Error"})
        console.log(error.message)
      }
    }
  },
  async getChannelUnpublishedVideos(req:Request, res:Response){
    try {
      const { name } = req.user
      const data = req.body 
      const videos = await videoService.getChannelUnpublishedVideos({ 
        name,
        ...data
      })
      res.status(200).json({
        videos,
        cursor: req.body.skip + 1, 
      })
      return 
    } catch (error) {
       if(error instanceof Error){
        res.status(500).json({message: "Server Error"})
        console.log(error.message)
      }
    }
  },
  async deleteVideo(req:Request, res:Response){
    try {
      const { id } = req.body 
      await videoService.deleteVideo( { id } )
      res.status(200).json({ message: "Video Deleted" })
      return 
    } catch (err) {
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "Something wrong happend while deleting the video"})
        return;
      }
    }
  },
  async updateVideo(req:Request,res:Response){
    try {
      const data = req.body 
      const video = await videoService.updateVideo(data)
      res.status(200).json(video)
      return 
    } catch (error) {
      if(error instanceof Error){
        console.log(error.message)
        res.status(500).json({message: "Something wrong happend while updating the video"})
        return;
      }      
    }
  },
  async updateLikeVideoStatus(req:Request, res:Response){
    try {
      const data = req.body
      await videoService.upsertUserVideoLikeStatus(data)
      res.status(200).json("Video likes status updated")
      return
    } catch (err) {
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "Something wrong happend while updating the video"})
        return;
      }
    }
  },
  async getUserVideoStatus(req:Request, res:Response){
    try {
      const { id } = req.user
      const { videoId } = req.body
      const status = await videoService.getUserVideoStatus({ userId: id, videoId})
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
