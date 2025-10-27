import * as jwt from "jsonwebtoken"
import { UserDto } from '../validations/user/dto'
import {access, refresh} from "./key"

export const refreshToken = ( userData:UserDto.AuthUserDto )=>{
    const token = jwt.sign(
        userData,
        refresh,
        { expiresIn: '1d' }
    )
    return token
}
export const accessToken = ( userData:UserDto.AuthUserDto )=>{
    const token = jwt.sign(
        userData,
        access,
        { expiresIn: '15m' }
    )
    return token
}