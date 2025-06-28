import * as jwt from "jsonwebtoken"
import { UserDto } from '../zod/user/dto'
import {access, refresh} from "./key"

export const refreshToken = ( userId:UserDto.UserIdDto )=>{
    const token = jwt.sign(
        userId,
        refresh,
        { expiresIn: '1d' }
    )
    return token
}
export const accessToken = ( userId:UserDto.UserIdDto )=>{
    const token = jwt.sign(
        userId,
        access,
        { expiresIn: '15m' }
    )
    return token
}