const router = (require('express')).Router()
const errorMsg = require('../errors')
const auth = require('../middlewares/JWT_verifyToken')
const {video, user} = (require('../db')).models

router.get('/',async(req,res)=>{
    const {query} = req
    try {
        const allVideos = await video.findAll({
            where:
                {
                    published: true
                },
            include:
                {
                    model: user,
                    attributes:[
                        "username",
                        "image",
                    ]
                },
            limit: query?.limit,
            offset: query?.page
        })   
        return res.status(200).json({videos: allVideos})
    } catch (error) {
        return res.status(500).json({message: errorMsg[500], error: error.message})
    }
})

module.exports = router