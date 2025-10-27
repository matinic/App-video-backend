import bcrypt, { compare, hash } from "bcrypt";

export const comparePassword = async( password: string, encrypted: string)=>{
    return await compare(password,encrypted)
}

export const encryptPassword = async(  password: string )=>{
    return await hash(password,10)
}