import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from "express";
import userService from "../services/user.service";
import verifyToken  from "../utils/jwt/verify.token"
import { refreshToken, accessToken } from "../utils/jwt/generate.token"
import { UserDto } from "../utils/zod/user/dto"
import { comparePassword, encryptPassword } from "../utils/bcrypt"
import { v2 }  from "cloudinary"
import process from "process"

export default  {
  createUser: async(req:Request<{},{},UserDto.CreateUserDto>, res:Response) => {
    try {
      const { name, email, password } = req.body
      const userByName = await userService.getUserByName( name )
      if (userByName) {
        res.status(409).json({ message: "User already exist!" });
        return;
      }
      const userByEmail = await userService.getUserByEmail( email )
      if (userByEmail) {
        res.status(409).json({ message: "Email already in use, choose other!" });
        return;
      }
      req.body.password = await encryptPassword( password )
      await userService.createUser(req.body);  
      res.status(201).json({message:"user created successfully"}).redirect("/login");
    }catch (err) {
      if(err instanceof Error){
        res.status(500).json({message: err.message})
      }
    }
  },
  // Function to get a user by ID
  // This function retrieves a user by their ID from the database
  getUserById: async(req:Request<UserDto.UserIdDto>, res:Response) => {
    try {
      const foundUser = await userService.getUserById( req.params )
      if(!foundUser){
        res.status(404).json({message: "User not found"})
        return;
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
  getUsers: async(req:Request<{},{},{},UserDto.GetUsersDto>, res:Response) => {
    try {
      const users = await userService.getUsers(req.query);
      res.status(200).json(users);
      return
    } catch ( err ) {
      if(err instanceof Error){
        res.status(500).json({message: "Server Error"})
        console.log(err.message)
      }
    }
  },
  deleteUserById: async(req:Request<{},{},UserDto.UserIdDto>,res:Response) => {
    try {
      const deletedUser = await userService.deleteUserById( req.body )
      res.status(200).json(deletedUser)
      return
    } catch (err) {
      if(err instanceof Error){
        console.log(err.message)
        res.status(500).json({message: "User not deleted"})
        return;
      }
    }
  },
  getSession: async(req:Request<{},{},UserDto.GetSessionDto>,res:Response) => {
    try {
      const { nameOrEmail, password } = req.body;
      const foundUser = await userService.getUserByNameOrEmail(nameOrEmail)
      if(!foundUser) {
        res.status(404).json({message: "User not found"})
        return;
      }
      const isValidPassword = await comparePassword( password, foundUser.password)
      if(!isValidPassword) {
        res.status(401).json({message: "Invalid Password or User"})
        return;
      }
      const newRefreshToken = refreshToken({ userId: foundUser.id })
      const newAccessToken = accessToken({ userId: foundUser.id })
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
          loggedUser: foundUser
        });
      return 
    } catch (error) {
      if(error instanceof Error){
        console.log(error.message)
        res.status(500).json({message: "Server Error"})
      }
    }
  },
  updateSubscription: async(req:Request<{},{},UserDto.SubscriptionDto>,res:Response) => {
    try {
      if(req.body.subscriptionStatus === "subscribe"){
        await userService.createSubscription(req.body)
        res.status(200).json({message: "Subcription added" })
        return 
      }
      if(req.body.subscriptionStatus === "unsubscribe"){
        await userService.deleteSubscription(req.body)
        res.status(200).json({message: "Subscription deleted"})
        return
      }
      res.status(400).json({message: "Ivalid status option, must be subscribe or unsubscribe"})
    } catch (error) {
      if(error instanceof Error){
        console.log(error.message)
        res.status(500).json({
          message: `Something wrong happend: ${error.message}`
        })
      }
    }
  },
  getFollowedBy: async(req:Request<UserDto.UserIdDto>,res:Response) =>{
    try {
      const userFollowedBys = await userService.getFollowedBy( req.params )
      res.status(200).json(userFollowedBys)
      return
    } catch (error) {
      if(error instanceof Error){
        console.log(error.message)
        res.status(500).json({message: "Server Error"})
      }
    }
  },
  getFollowing: async(req:Request<UserDto.UserIdDto>, res:Response) => {
    try {
      const userFollowings = await userService.getFollowing( req.params )
      res.status(200).json(userFollowings)
      return
    } catch (error) {
      if(error instanceof Error){
        console.log(error.message)
        res.status(500).json({error: "Server error"})
      }
    }
  },
  getCloudinarySignature: async(req:Request,res:Response)=>{
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
      const decoded = await verifyToken({token,option:"refresh"}) as UserDto.UserIdDto
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
