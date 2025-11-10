import {z} from "zod"
import { Request, Response, NextFunction } from "express"

type validate<T> = {
    body: T,
    params?: T,
    query?: T
} | {
    body?: T,
    params: T,
    query?: T
} | {
    body?: T,
    params?: T,
    query: T
}

export default <T extends z.ZodTypeAny>( { body, params, query }: validate<T> )=>{
    return (req:Request, res:Response, next:NextFunction) => {
        if(body){
            const { data, success, error } = body.safeParse(req.body)
            if(!success) res.status(404).json(error.format)
            req.validatedBody = data
        }
        if(params){
            const { data, success, error } = params.safeParse(req.params)
            if(!success) res.status(404).json(error.format)
            req.validatedParams = data
        }
        if(query){
            const {data, success, error } = query.safeParse(req.query)
            if(!success) res.status(404).json(error.format)
            req.validatedQuery = data
        }
        next()
        return
    }
}