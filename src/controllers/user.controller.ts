import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from "express";
import UserService from "@/services/user.service";
import { HttpError } from "@/lib/errors/http.error";
import verifyToken from "@/lib/jwt/verify.token"
import { refreshToken, accessToken } from "@/lib/jwt/generate.token"
import { UserDto } from "@/lib/zod/dto/user"
import { comparePassword, encryptPassword } from "@/lib/bcrypt"
import { v2 } from "cloudinary"
import process from "process"
import NotificationService from "@/services/notification.service"

class UserController {
    constructor(private userService: UserService, private notificationService: NotificationService) {}
  async createUser(req:Request, res:Response){
    const { name, email, password } = req.validatedBody
    const userByName = await this.userService.checkUserName( { name } )
    if (userByName) {
      throw new HttpError(409, "User already exist!");
    }
    const userByEmail = await this.userService.checkUserEmail( { email } )
    if (userByEmail) {
      throw new HttpError(409, "Email already in use, choose other!");
    }
    const encryptedPassword = await encryptPassword( password )
    const newUser = await this.userService.createUser({
      ...req.validatedBody,
      password: encryptedPassword
    });  
    res.status(201).json({
      message:"user created successfully",
      userId: newUser.id
    });
  }
  // Function to get a user by ID
  // This function retrieves a user by their ID from the database
  async getChannelInfo(req:Request, res:Response){
    const data = req.user
    const { name } = req.validatedParams
    if( data?.name === name ){
      const foundUser = await this.userService.getAuthChannelInfo( req.user )
      res.status(200).json( foundUser )
      return 
    }
    const foundUser = await this.userService.getChannelInfo( { name } )
    if(!foundUser){
      throw new HttpError(404, "User not found");
    }
    res.status(200).json(foundUser);
  }
  async deleteUser(req:Request, res:Response){
    const { id } = req.user
    const deletedUser = await this.userService.deleteUserById( { id } )
    res.status(200).json({
      message: "User deleted successfully",
      userId: deletedUser.id,
      name: deletedUser.name
    });
  }
  async getSession(req:Request, res:Response){
    const { nameOrEmail, password } = req.validatedBody;
    const foundUser = await this.userService.getUserByNameOrEmail( nameOrEmail )
    if(!foundUser) {
      throw new HttpError(404, "User not found");
    }
    const isValidPassword = await comparePassword( password, foundUser.password )
    if(!isValidPassword) {
      throw new HttpError(401, "Invalid Password or User");
    }
    const userData = {
      name: foundUser.name,
      id: foundUser.id
    }
    const newRefreshToken = refreshToken(userData)
    const newAccessToken = accessToken(userData)
    await this.userService.updateRefreshToken({
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
  }
  async updateUserStatusSubscription(req:Request, res:Response){
    const { id } = req.validatedParams
    const data = req.user
    const status = await this.userService.checkSubscription({
      channelId: id,
      subscriberId: data.id
    })
    if(!status){
      await this.userService.createSubscription(req.validatedBody)
      await this.notificationService.createNewSubscriptionNotification({
        userEmmiterId: data.id,
        userDestinationId: id
      })
      res.status(200).json({message: "Subcription added" });
      return 
    }
    await this.userService.deleteSubscription(req.validatedBody)
    res.status(200).json({message: "Subscription deleted"});
  }
  async getSubscribers(req:Request, res:Response){
    const { id } = req.user
    const pagination = req.validatedBody
    const subscribers = await this.userService.getSubscribers({
      id,
      ...pagination
    })
    res.status(200).json(subscribers);
  }
  async getSubscriptions(req:Request, res:Response){
    const { id } = req.user
    const pagination = req.validatedBody
    const subcriptions = await this.userService.getSubscriptions({
      id,
      ...pagination
    })
    res.status(200).json({ subcriptions });
  }
  async checkSubscription (req:Request, res:Response){
    const { id } = req.user
    const { channelId } = req.validatedParams
    const isSubscribed = await this.userService.checkSubscription({
      subscriberId: id,
      channelId
    })
    res.status(200).json({
      channelId,
      isSubscribed
    });
  }
  async getCloudinarySignature(req:Request, res:Response){
    let body = req.validatedBody
    if(!req.validatedBody) body = {}
    const timestamp = Math.round((new Date).getTime()/1000)
    const signature = v2.utils.api_sign_request(
      {
        timestamp,
        ...body
      },
      process.env.API_SECRET as string
    )
    res.status(200).json({timestamp,signature});
  }
  async updateRefreshToken(req:Request,res:Response){
    const cookies = req.cookies
    if(!cookies.jwt){ 
      throw new HttpError(401, "Credentials not found");
    }
    const token = cookies.jwt
    const decoded = verifyToken({token,option:"refresh"});
    const newAccesstoken = accessToken( decoded )
    res.status(200).json({accessToken: newAccesstoken});
  }
}

export default UserController;
