const errorMsg = require('../errors')
const { video, user } = (require('../db').models)
const { Op } = require('../db')
const auth = require('../middlewares/JWT_verifyToken')

const router = (require('express')).Router()

router.get('/',async(req,res)=>{

    const page = req.query.page || 0

    const limit = req.query.limit || 1

    const searchParametres = req.query.q.split("-").join("%")

    console.log(searchParametres)

    try{

        const startsWith = await video.findAll({
            where: {
                published: true,
                title: {
                    [Op.startsWith]: `%${searchParametres}%`,
                },
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
            limit,
            offset: page * limit,
        })

        const iLike = await video.findAll({
            where: {
                published: true,
                title: {
                    [Op.iLike]: `%${searchParametres}%`,
                },
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
            limit,
            offset: page * limit,
        })

        const iLikeDescription = await video.findAll({
            where: {
                published: true,
                description: {
                    [Op.iLike]: `%${searchParametres}%`,
                },
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
            limit,
            offset: page * limit,
        })

        const iLikeUsername = (await user.findAll({
            where: {
                username: {
                    [Op.iLike]: `%${searchParametres}%`,
                },
            },
            attributes: [],
            include: {
                where: {
                    published: true
                },
                model: video,
                attributes:{exclude: ["description",'userId','published','likes','createdAt','updatedAt']},
                include:
                {
                    model: user,
                    attributes:[
                        "username",
                        "image",
                    ],
                },
            },
            limit,
            offset: page * limit,
        })).map(elem => elem.videos)

        const videos = [...startsWith,...iLike,...iLikeDescription,...iLikeUsername]

        if(!videos.length) return res.status(200).json({videos: [], nextCursor: 0})

        return res.status(200).json({videos, nextCursor: +page + 1})

    }catch(error){
        if(error instanceof Error) return res.status(500).json({message: error.message})
        return res.status(500).json({message: errorMsg[500]})
    }
})  

module.exports = router