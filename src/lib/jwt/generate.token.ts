import jwt, { JwtPayload } from "jsonwebtoken"
import {access, refresh} from "./key"

export const refreshToken = ( userData: JwtPayload  )=>{
    const token = jwt.sign(
        userData,
        refresh,
        { expiresIn: '1d' }
    )
    return token
}
export const accessToken = ( userData: JwtPayload )=>{
    const token = jwt.sign(
        userData,
        access,
        { expiresIn: '15m' }
    )
    return token
}