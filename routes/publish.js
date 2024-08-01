const router = (require('express')).Router()
const errorMsg = require('../errors')
const auth = require('../middlewares/JWT_verifyToken')
const {video} = (require('../db')).models

router.put('/',auth,async(req,res)=>{

    try {

        if(!req.query.id) throw Error(errorMsg[400])

        if(typeof req.body.published !== 'boolean') throw Error('Invalid Data')

        console.log(req.body.published)
    
        const videoFound = await video.findOne({where: {id: req.query.id}})

        if(!videoFound) throw Error(errorMsg['404_video'])
    
        videoFound.published = req.body.published

        await videoFound.save()

        return res.status(200).json('Video updated')
        
    } catch (error) {
        if(typeof error === "string"){
            return res.status(400).json(error)
        }
        if(error instanceof Error){
            return res.status(500).json({message: errorMsg[500], error: error.message})
        }

    }
})

module.exports = router