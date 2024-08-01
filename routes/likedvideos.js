const errorMsg = require('../errors')
const { video, user } = (require('../db').models)
const auth = require('../middlewares/JWT_verifyToken')

const router = (require('express')).Router()

router.get('/',auth,async(req,res)=>{

    const { username } = req

    try{
        const userFound =   await user.findOne({where :{username}})
        if(!userFound) return res.status(200).json({message: errorMsg['404_user']})
        //Search for the information of the videos using the "likedVideos" attribute
        const likedVideos = await video.findAll({
            where:{ id: userFound.likedVideos },
            include:{
                model: user,
                attributes: ['id','username','image']
            },
            limit: req.query?.limit,
            offset: req.query?.page
        })
        
        return res.status(200).json([...likedVideos])
    }catch(error){
        return res.status(200).json({message: errorMsg[500]})
    }
})  

module.exports = router