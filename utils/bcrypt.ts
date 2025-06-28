import bcrypt, { compare, hash } from "bcrypt";
import { UserDto } from "./zod/user/dto";

export const comparePassword = async( password:UserDto.PasswordDto, encrypted:string)=>{
    return await compare(password,encrypted)
}

export const encryptPassword = async( password:UserDto.PasswordDto)=>{
    return await hash(password,10)
}