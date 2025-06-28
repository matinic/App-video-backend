import {z} from "zod"
import { Request, Response, NextFunction } from "express"

export default {
    reqBody: <T extends z.ZodTypeAny> (schema: T) => {
        return (req:Request<{},{},z.infer<T>>,res:Response,next:NextFunction)=>{
            const { data, success, error } = schema.safeParse(req.body)
            if(!success){
                console.error(error.format())
                res.status(200).json({
                    message: error.format()
                })
                return
            }
            req.body = data
            next()
        }
    },
    reqQuery: <T extends z.ZodTypeAny> (schema: T) => {
        return (req:Request<{},{},{},z.infer<T>>,res:Response,next:NextFunction)=>{
            const { data, success, error } = schema.safeParse(req.query)
            if(!success){
                console.error(error.format())
                res.status(200).json({
                    message: error.format()
                })
                return
            }
            req.query = data
            next()
        }
    },
    reqParams: <T extends z.ZodTypeAny> (schema: T) => {
        return (req:Request<z.infer<T>,{},{},{}>,res:Response,next:NextFunction)=>{
            const { data, success, error } = schema.safeParse(req.params)
            if(!success){
                console.error(error.format())
                res.status(200).json({
                    message: error.format()
                })
                return
            }
            req.params = data
            next()
        }
    },
}