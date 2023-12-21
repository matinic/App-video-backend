const router = (require('express')).Router()
const errorMsg = require('../errors')
const auth = require('../middlewares/JWT_verifyToken')
const {video} = (require('../db')).models

router.put('/',auth,async(req,res)=>{

    const body = req.body

    if(!body.id) return res.status(400).json({message: errorMsg[400]})

    if(typeof body.published !== 'boolean') return res.status(400).json({message: 'The publication data is invalid or non-existent'})

    try {
    
        const videoFounded = await video.findOne({where: {id: body.id}})

        if(!videoFounded) return res.status(404).json({message: errorMsg['404_video']})
    
        videoFounded.published = body.published

        await videoFounded.save()

        return res.status(200).json({message: 'Video updated'})
        
    } catch (error) {
        
        return res.status(500).json({message: errorMsg[500], error: error.message})

    }
})

module.exports = router