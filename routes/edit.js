const router = (require('express')).Router()
const {video} = (require('../db')).models
const auth = require('../middlewares/JWT_verifyToken')
const errorMsg = require('../errors')

router.patch('/',auth,async(req,res)=>{

    // if(Object.entries(req.body).includes('publish')) return res.status(400).json({message: '< publish > property cannot be changed in this route'})

    const body = req.body

    const id = body?.id

    if(!id) return res.status(400).json({message: errorMsg[400]})

    try {
        const foundedVideo = await video.findOne({
            where:{
                id: id
            }
        })
    
        if(!foundedVideo) return res.status(404).json({message: 'video not found'})

        const changed = await foundedVideo.update(req.body)

        return res.status(200).json(changed)
        
    } catch (error) {
        
        return res.status(500).json({message: errorMsg[500], error: error.message})

    }

})

module.exports = router