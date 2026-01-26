import {z, ZodTypeAny} from "zod"
import { Request, Response, NextFunction } from "express"

type Validate = {
    body?: ZodTypeAny,
    params?: ZodTypeAny,
    query?: ZodTypeAny
}

export default <T extends Validate>( { body, params, query }: T )=>{
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