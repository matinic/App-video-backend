import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from "express";
import UserService from "@/services/user.service";
import { HttpError } from "@/lib/errors/http.error";
import verifyToken from "@/lib/jwt/verify.token"
import { refreshToken, accessToken } from "@/lib/jwt/generate.token"
import { comparePassword, encryptPassword } from "@/lib/bcrypt"
import { v2 } from "cloudinary"
import process from "process"
import { NotificationEmitter as emiter } from '@/lib/notification/notification.emitter';
import { UserDto } from '@/lib/zod.schemas/user.schema';
import { BaseDto } from '@/lib/zod.schemas/base.schema';

class UserController {
  constructor(private userService: UserService) {}
  async createUser(req:Request, res:Response){
    const newUserData = req.validatedBody as UserDto.CreateUserDto
    const userByName = await this.userService.getUser( { name: newUserData.name } )
    if (userByName) {
      throw new HttpError(409, "User already exist!");
    }
    const encryptedPassword = await encryptPassword( newUserData.password )
    const newUser = await this.userService.createUser({
      ...newUserData,
      password: encryptedPassword
    });
    emiter.emit("userCreated",{
      userEmail: newUser.email,
      userImageUrl: newUser.image,
      userId: newUser.id,
      userName: newUser.name
    })
    res.status(201).json({
      message:"user created successfully",
      userId: newUser.id
    });
  }
  // Function to get a user by ID
  // This function retrieves a user by their ID from the database
  async getUser(req:Request, res:Response){
    const authUser = req.user as UserDto.UserAuthDto
    const userNameParam = req.validatedParams as BaseDto.NameDto
    const foundUser = await this.userService.getUser({
      name: userNameParam,
      auth: userNameParam === authUser.name
    })
    if(!foundUser){
      throw new HttpError(404, "User not found")
    }
    res.status(200).json( foundUser ) 
  }
  async deleteUser(req:Request, res:Response){
    const { id } = req.user
    const deletedUser = await this.userService.deleteUser( id )
    if(!deletedUser){
      throw new HttpError(500, "Error while deleting user")
    }
    res.status(200).json({
      message: "User deleted successfully",
    });
  }
  async getSession(req:Request, res:Response){
    const { requiredData, password } = req.validatedBody as UserDto.GetUserSessionDto;
    const foundUser = await this.userService.findSessionUser( requiredData );
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
  async updateFollowStatus(req:Request, res:Response){
    const { id: channelId } = req.validatedParams 
    const user = req.user as UserDto.UserAuthDto
    const statusFollow = await this.userService.getFollowStatus( { channelId, followerId: user.id } )
    if(!statusFollow){
      await this.userService.unfollowChannel({ channelId, followerId: user.id })
  //Add notification event
      res.status(200).json({message: "Subcription added" });
      return 
    }
    await this.userService.followChannel(req.validatedBody)
    res.status(200).json({message: "Subscription deleted"});
  }
  async getSubscribers(req:Request, res:Response){
    const { id } = req.user
    const pagination = req.validatedBody
    const subscribers = await this.userService.getFollowers({
      id,
      ...pagination
    })
    res.status(200).json(subscribers);
  }
  async getChannelsFollowing(req:Request, res:Response){
    const authUser = req.user as UserDto.UserAuthDto
    const { id: userId,  } = req.validatedBody as UserDto.GetChannelsFollowingDto
    const channelsFollowing = await this.userService.getChannelsFollowing({  })
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
