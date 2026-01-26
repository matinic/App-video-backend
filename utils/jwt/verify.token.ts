import * as jwt from "jsonwebtoken"
import { Verify } from "./dto"
import {access, refresh} from "./key"

export default async (verify:Verify): Promise<jwt.JwtPayload> => {
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



