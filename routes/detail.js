require('dotenv').config()
const errorMsg = require('../errors')
const router = (require('express')).Router()
const {video,user} = (require('../db').models)
const jwt = require("jsonwebtoken")

router.get('/',async(req,res)=>{
    
    const {id} = req.query

    if(!id) return res.status(400).json({message: errorMsg[400]})
    
    try {
        const videoFound = await video.findByPk(id,{
            attributes: {
                exclude:['userId']
            },
            include:{
                model: user,
                attributes: ['id','image','username','followersCount']
            }
        })
        
        if(!videoFound) return res.status(404).json({message: errorMsg['404_video']})

        if(videoFound.published){
            return res.status(200).json({...videoFound.dataValues})
        }else{
            const header = req?.headers?.authorization
            if(!header) throw new Error("not allowed")
            const token = header.split(" ")[1]
            jwt.verify(token, process.env.JWT_ACCESS, (err,decoded)=>{
                    if(err) throw new Error("not allowed")
                    if(decoded.username === videoFound.user.username){
                        return res.status(200).json({...videoFound.dataValues})
                    }else{
                        throw new Error("not allowed")
                    }
                }
            )
        }

    } catch (error) {
        if(error instanceof Error){
            return res.status(401).json({message: error.message})
        }
        if(typeof error === "string"){
            return res.status(500).json({message: error})
        }
        
    }
    
})

module.exports = router