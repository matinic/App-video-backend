const errorMsg = require('../errors')
const { user } = (require('../db').models)
const auth = require('../middlewares/JWT_verifyToken')

const router = (require('express')).Router()

router.get('/',async(req,res)=>{

    const username = req.username

    const {videoId} = req.query

    if(!id) return res.status(400).json({message: errorMsg[400]})

    try {

        const userFounded = await user.findOne({username : username})

        if(!userFounded) return res.status(404).json({message: errorMsg['404_user']})

        userFounded.liked.push(videoId)

        await userFounded.save()

        return res.status(200).json({message: "List updated successfully"})
        
    } catch (error) {
        
        return res.status(500).json({message: errorMsg, error: error.message})

    }



})

module.exports = router