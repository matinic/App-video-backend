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
            attributes:{exclude: ["description",'userId','published','likes','createdAt','updatedAt']},
            include:
                {
                    model: user,
                    attributes:[
                        "username",
                        "image",
                    ],
                },
            order: [['createdAt', 'DESC']],
            limit: query?.limit,
            offset: query?.page * query?.limit
        })  
        return res.status(200).json({videos: allVideos, nextCursor: +query?.page+1})
    } catch (error) {
        return res.status(500).json({message: errorMsg[500], error: error.message})
    }
})

module.exports = router