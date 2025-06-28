import dotenv from 'dotenv'
dotenv.config()
import { NextFunction, Request, Response } from "express"
import verifyToken from "../jwt/verify.token"
import { UserDto } from '../zod/user/dto'

export const auth = async( req:Request, res:Response, next:NextFunction )=>{
    try {
      const header = req.headers['authorization']
      if(!header){
        res.sendStatus(401)
        return
      }
      const token = header.split(' ')[1]
      const userId = await verifyToken({token,option: "access"}) as UserDto.UserIdDto
      if(!userId) {
        res.sendStatus(403)
        return
      }
      req.body = { ...req.body, userId }
      next()
    } catch (error) {
      res.clearCookie('jwt',{httpOnly: true, secure: true})  
      res.status(500).json({message: "Server Error"})
    }
}



