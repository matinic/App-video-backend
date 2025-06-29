import { Request, Response } from "express";
import videoService  from "../services/video.service";
import { VideoDto } from "../utils/zod/video/dto"
// Function to create a new video
//aca se implementaria IVideo tambien

export default {
  createVideo: async (req:Request<{},{},VideoDto.CreateVideoDto>, res:Response) => {
    try {
      const createdVideo = await videoService.createVideo(req.body)
      res.status(201).json({message:"video created successfully"}).redirect(`/video/${createdVideo.id}`);
      return
    }catch (err) {
      if(err instanceof Error){
        res.status(500).json({message: "Something wrong happend while uploading the video"})
        console.log(err.message)
      }
    }
  },
  getVideoById: async (req:Request<VideoDto.VideoIdDto>,res:Response) => {
    try {
      const foundVideo = await videoService.getVideoById(req.params)
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
  getPublishedVideos: async(req:Request<{},{},{},VideoDto.GetVideosDto>, res:Response)=> {
    try {
      const videos = await videoService.getPublishedVideosPaginated(req.query);
      res.status(200).json(videos);
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
  getVideosBySearch: async(req:Request<{},{},{},VideoDto.GetVideoBySearchQueryDto>,res:Response)=>{
    try {
      const { searchQuery, filterQuery } = req.query;
      const keywords = searchQuery
        .trim()
        .split(/\s+/) // separar por espacios, múltiple
        .filter(Boolean); // evitar strings vacíos
      const videos = await videoService.getVideosBySearch(keywords, filterQuery);
      res.status(200).json(videos);
    } catch (error) { 
       if(error instanceof Error){
        res.status(500).json({message: "Server Error"})
        console.log(error.message)
      }
    }
  },
  getVideosByAuthor: async(req:Request<{},{},{},VideoDto.GetVideoByAuthorDto>, res:Response) =>{ 
    try {
      const videosFound = await videoService.getVideosByAuthor(req.query)
      res.status(200).json(videosFound)
    } catch (error) {
       if(error instanceof Error){
        res.status(500).json({message: "Server Error"})
        console.log(error.message)
      }
    }
  },
  deleteVideo: async(req:Request<{},{},VideoDto.VideoIdDto>, res:Response)=>{
    try {
      await videoService.deleteVideo( req.body )
      res.status(200).json({ message: "Video Deleted" })
    } catch (err) {
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "Something wrong happend while deleting the video"})
        return;
      }
    }
  },
  updateVideo: async(req:Request<{},VideoDto.UpdateVideoDto>,res:Response)=>{
    try {
      const videoUpdated = await videoService.updateVideo(req.body)
      res.status(200).json(videoUpdated)
    } catch (error) {
      if(error instanceof Error){
        console.log(error.message)
        res.status(500).json({message: "Something wrong happend while updating the video"})
        return;
      }      
    }
  },
  postLike: async(req:Request<{},{},VideoDto.LikeStatusDto>,res:Response)=>{
    try {
      const userAlreadyLiked = await videoService.getVideoIfUserAlreadyLiked(req.body)
      const userAlreadyDisliked = await videoService.getVideoIfUserAlreadyDisliked( req.body)
      // Check if the user has already liked the video
      if(userAlreadyLiked) {
        //Remove Like
        await videoService.deleteVideoLike(req.body)
        res.status(200).json({message:"Video likes status updated"})
        return
      }
      // Check if the user has already disliked the video
      else if(userAlreadyDisliked){
        //Remove Dislike
        await videoService.deleteVideoDislike(req.body)
      }
      //Add Like
      await videoService.createVideoLike(req.body)
      
      res.status(200).json("Video likes status updated")
      return;

    } catch (err) {
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "Something wrong happend while updating the video"})
        return;
      }
    }
  },
  postDislike: async(req:Request<{},{},VideoDto.LikeStatusDto>,res:Response)=>{
     try {
      const userAlreadyLiked = await videoService.getVideoIfUserAlreadyLiked(req.body)
      const userAlreadyDisliked = await videoService.getVideoIfUserAlreadyDisliked( req.body)
      // Check if the user has already disliked the video
      if(userAlreadyDisliked) {
        //Remove disLike 
        await videoService.deleteVideoDislike( req.body )
        res.status(200).json({message:"Video Dislikes Status Updated"})
        return
      }
      // Check if the user has already liked the video
      else if(userAlreadyLiked){
        //Remove like
        await videoService.deleteVideoLike(req.body)
      }
      //Add disLike
      await videoService.createVideoDislike(req.body)
      
      res.status(200).json("Video Dislikes Status Updated")
      return;

    } catch (err) {
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "Something wrong happend while updating the video"})
        return;
      }
    }
  }
}
