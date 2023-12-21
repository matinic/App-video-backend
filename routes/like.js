const errorMsg = require('../errors')
const { video, user } = (require('../db').models)
const auth = require('../middlewares/JWT_verifyToken')

const router = (require('express')).Router()

router.put('/',auth,async(req,res)=>{

    const username = req.username

    const videoId = req.body?.id

    try {

        if(!videoId) return res.status(400).json({message: errorMsg[400]})

        const videoFounded = await video.findByPk(videoId)

        if(!videoFounded) return res.status(404).json({message: errorMsg['404_video']})

        const userFounded = await user.findOne({
            where: {
                username: username
            }
        })

        if(!userFounded) return res.status(404).json({message: errorMsg['404_user']})

        const likedVideoExist = userFounded?.likedVideos?.includes(videoId)
        
        if(likedVideoExist)  {
            //delete the id from the array
            const indexOfvideoId = userFounded.likedVideos.indexOf(videoId)
            userFounded.likedVideos.splice(indexOfvideoId,1)
            //force change in array so save() can detect it
            userFounded.changed('likedVideos',true)
            await userFounded.save()
            videoFounded.likes = videoFounded.likes - 1
            await videoFounded.save()
            return res.status(200).json({message: "Video like removed"})
        }
        
        if(userFounded.likedVideos === null) userFounded.likedVideos = []

        userFounded.likedVideos.push(videoId)

        userFounded.changed('likedVideos',true)

        await userFounded.save()

        videoFounded.likes = videoFounded.likes + 1

        await videoFounded.save()

        return res.status(200).json({message: "Video like added"})
        
    } catch (error) {
        
        return res.status(500).json({message: errorMsg[500], error: error.message})

    }

})

module.exports = router