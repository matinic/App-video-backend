import jwt from "jsonwebtoken"
import { access, refresh } from "./key"

export default async (verify:{
  token: string
  option: "access" | "refresh"
}): Promise<jwt.JwtPayload> => {
  try {
    if(verify.option ===  "access"){
      const decoded = jwt.verify(verify.token, access);
      if (typeof decoded === 'object') {
       return decoded as jwt.JwtPayload;
      } 
    }
    else if(verify.option ===  "refresh"){
      const decoded = jwt.verify(verify.token, refresh);
      if (typeof decoded === 'object') {
        return decoded as jwt.JwtPayload;
      }
    }
    return new Error("Invalid verify option")
  } catch (error) {
    if(error instanceof Error){
      console.log(error)
      return new Error(`Something wrong happend while verify token: ${error.message}`)
    }
    return new Error("Something wrong happend while verify token")
  }
};



