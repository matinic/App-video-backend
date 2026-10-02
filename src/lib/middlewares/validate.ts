import { z, ZodType } from "zod"
import { Request, Response, NextFunction } from "express"

type Validate = {
    body?: ZodType<any>,
    params?: ZodType<any>,
    query?: ZodType<any>
}

export default <T extends Validate>( { body, params, query }: T )=>{
    return (req:Request, res:Response, next:NextFunction) => {
        if(body){
            const result = body.safeParse(req.body)
            if(!result.success) {
                res.status(400).json({ message: "Validation failed", issues: result.error.issues })
                return
            }
            req.validatedBody = result.data
        }
        if(params){
            const result = params.safeParse(req.params)
            if(!result.success) {
                res.status(400).json({ message: "Validation failed", issues: result.error.issues })
                return
            }
            req.validatedParams = result.data
        }
        if(query){
            const result = query.safeParse(req.query)
            if(!result.success) {
                res.status(400).json({ message: "Validation failed", issues: result.error.issues })
                return
            }
            req.validatedQuery = result.data
        }
        next()
        return
    }
}