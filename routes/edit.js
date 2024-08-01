const router = (require('express')).Router()
const {video} = (require('../db')).models
const auth = require('../middlewares/JWT_verifyToken')
const errorMsg = require('../errors')

router.patch('/',auth,async(req,res)=>{

    if(!req.query?.id) return res.status(400).json({message: errorMsg[400]})

    try {
        const foundVideo = await video.findByPk(req.query?.id)
    
        if(!foundVideo) return res.status(404).json({message: 'video not found'})

        const changed = await foundVideo.update(req.body)

        return res.status(200).json(changed)
        
    } catch (error) {
        
        return res.status(500).json({message: errorMsg[500], error: error.message})

    }

})

module.exports = router