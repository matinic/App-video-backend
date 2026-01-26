import dotenv from 'dotenv'
dotenv.config()
import { NextFunction, Request, Response } from "express"
import verifyToken from "../jwt/verify.token"
import { UserDto } from '../validations/user/dto'

export default ( strict = true )=>{
  return ( async( req:Request, res:Response, next:NextFunction )=>{
      try {
        const header = req.headers['authorization']
        if(!header){
          res.sendStatus(401)
          return
        }
        const token = header.split(' ')[1]
        const user = await verifyToken({token,option: "access"}) as UserDto.AuthUserDto
        if(strict && !user){
          res.sendStatus(401)
          return
        }
        req.user = user
        next()
      } catch (error) {
        res.clearCookie('jwt',{httpOnly: true, secure: true})  
        res.status(500).json({message: "Server Error"})
      }
  })
}




