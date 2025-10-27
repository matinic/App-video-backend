import {z} from "zod"
import { Request, Response, NextFunction } from "express"

export default<T extends z.ZodTypeAny> (schema:T, from:"body" | "params" | "query" )=>{
    return (req:Request, res:Response, next:NextFunction) => {
        if(from){
            const { data, success, error } = schema.safeParse(req[from])
            if(!success){
                console.error(error.format())
                res.status(200).json({
                    message: error.format()
                })
                return
            }
            if(from === "body"){
                req.body = data
            }
            if(from === "query"){
                req.validatedQuery = data
            }
            next()
            return
        }
        res.status(500).json({error: "Server Error"})
        console.log("Invalid info type")
        return
    }
}
