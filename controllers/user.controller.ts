import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from "express";
import userService from "../services/user.service";
import verifyToken  from "../utils/jwt/verify.token"
import { refreshToken, accessToken } from "../utils/jwt/generate.token"
import { UserDto } from "@/utils/validations/user/dto"
import { comparePassword, encryptPassword } from "../utils/bcrypt"
import { v2 }  from "cloudinary"
import process from "process"
import notificationService from "@/services/notification.service"

export default  {
  async createUser(req:Request, res:Response){
    try {
      const { name, email, password } = req.body
      const userByName = await userService.checkUserName( { name } )
      if (userByName) {
        res.status(409).json({ message: "User already exist!" });
        return;
      }
      const userByEmail = await userService.checkUserEmail( { email } )
      if (userByEmail) {
        res.status(409).json({ message: "Email already in use, choose other!" });
        return;
      }
      const encryptedPassword = await encryptPassword( password )
      const newUser = await userService.createUser({
        ...req.body,
        password: encryptedPassword
      });  
      res.status(201).json({
        message:"user created successfully",
        userId: newUser.id
      }) ;
      return
    }catch (err) {
      if(err instanceof Error){
        res.status(500).json({message: err.message})
        return
      }
    }
  },
  // Function to get a user by ID
  // This function retrieves a user by their ID from the database
  async getChannelInfo(req:Request, res:Response){
    try {
      const data = req.user
      const { name } = req.params
      if( data?.name === name ){
        const foundUser = await userService.getAuthChannelInfo( req.user )
        res.status(200).json( foundUser )
        return 
      }
      const foundUser = await userService.getChannelInfo( { name } )
      if(!foundUser){
        res.status(404).json({message: "User not found"})
        return
      }
      res.status(200).json(foundUser)
      return
    }catch (err) {
      if(err instanceof Error){
          res.status(500).json({ message: "Server Error" })
          console.log(err.message)
      }
    }
  },
  async deleteUser(req:Request, res:Response){
    try {
      const { id } = req.user
      const deletedUser = await userService.deleteUserById( { id } )
      res.status(200).json({
        message: "User deleted successfully",
        userId: deletedUser.id,
        name: deletedUser.name
      })
      return
    } catch (err) {
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "User not deleted"})
        return;
      }
    }
  },
  async getSession(req:Request, res:Response){
    try {
      const { nameOrEmail, password } = req.body;
      const foundUser = await userService.getUserByNameOrEmail( nameOrEmail )
      if(!foundUser) {
        res.status(404).json({message: "User not found"})
        return;
      }
      const isValidPassword = await comparePassword( password, foundUser.password )
      if(!isValidPassword) {
        res.status(401).json({message: "Invalid Password or User"})
        return;
      }
      const userData = {
        name: foundUser.name,
        id: foundUser.id
      }
      const newRefreshToken = refreshToken(userData)
      const newAccessToken = accessToken(userData)
      await userService.updateRefreshToken({
        userId: foundUser.id,
        refreshToken: newRefreshToken
      })
      res
        .status(200)
        .cookie('jwt', foundUser.refreshToken, { httpOnly: true, secure: true })
        .json({
          message:"User Logged Successfully",
          accessToken: newAccessToken,
          isLogged: true,
          user: {
            id: foundUser.id,
            name: foundUser.name,
            image: foundUser.image
          }
        });
      return 
    } catch (error) {
      if(error instanceof Error){
        console.error(error.message)
        res.status(500).json({message: "Server Error"})
      }
    }
  },
  async updateUserStatusSubscription(req:Request, res:Response){
    try {
      const { id } = req.params
      const data = req.user
      const status = await userService.checkSubscription({
        channelId: id,
        subscriberId: data.id
      })
      if(!status){
        await userService.createSubscription(req.body)
        await notificationService.createNewSubscriptionNotification({
          userEmmiterId: data.id,
          userDestinationId: id
        })
        res.status(200).json({message: "Subcription added" })
        return 
      }
      else{
        await userService.deleteSubscription(req.body)
        res.status(200).json({message: "Subscription deleted"})
        return
      }
    }catch (error) {
      if(error instanceof Error){
        console.log(error.message)
        res.status(500).json({
          message: `Something wrong happend: ${error.message}`
        })
      }
    }
  },
  async getSubscribers(req:Request, res:Response){
    try {
      const { id } = req.user
      const pagination = req.body
      const subscribers = await userService.getSubscribers({
        id,
        ...pagination
      })
      res.status(200).json(subscribers)
      return 
    } catch (error) {
      if(error instanceof Error){
        console.log(error.message)
        res.status(500).json({message: "Server Error"})
      }
    }
  },
  async getSubscriptions(req:Request, res:Response){
    try {
      const { id } = req.user
      const pagination = req.body
      const subcriptions = await userService.getSubscriptions({
        id,
        ...pagination
      })
      res.status(200).json({ subcriptions })
      return 
    } catch (error) {
      if(error instanceof Error){ 
        console.log(error.message)
        res.status(500).json({error: "Server error"})
        return
      }
    }
  },
  async checkSubscription (req:Request, res:Response){
    try{
      const { id } = req.user
      const { channelId } = req.params
      const isSubscribed = await userService.checkSubscription({
        subscriberId: id,
        channelId
      })
      res.status(200).json({
        channelId,
        isSubscribed
      })
    }catch(error){
      if(error instanceof Error){ 
        console.log(error.message)
        res.status(500).json({error: "Server error"})
        return
      }
    }
  },
  async getCloudinarySignature(req:Request, res:Response){
    try {
      let body = req.body
      if(!req.body) body = {}
      const timestamp = Math.round((new Date).getTime()/1000)
      const signature = v2.utils.api_sign_request(
        {
          timestamp,
          ...body
        },
        process.env.API_SECRET as string
      )
      res.status(200).json({timestamp,signature})
      return
    } catch (error) {
      if( error instanceof Error ){
        console.error(error.message)
        res.status(500).json({message: "Something wrong happend while gettin the signature", error: error.name})
      }
      return 
    }
  },
  updateRefreshToken: async(req:Request,res:Response)=>{
    try {
      const cookies = req.cookies
      if(!cookies.jwt){ 
        res.status(401).json({message:"Credentials not found"})
        return
      }
      const token = cookies.jwt
      const decoded = await verifyToken({token,option:"refresh"}) as UserDto.AuthUserDto
      const newAccesstoken = accessToken( decoded )
      res.status(200).json({accessToken: newAccesstoken})
      return
    } catch (error) {
        if(error instanceof Error){
          console.error(error.message)
          res.status(500).json({message: "Something wrong happend while validating credentials", error: error.message})
        }
        return
    }
  }
}
