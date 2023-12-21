const auth = require('../middlewares/JWT_verifyToken')
const {video, user} = (require('../db')).models
const errorMsg = require('../errors')

const router = (require('express')).Router()

router.post('/',auth, async(req,res)=>{

  const { title, url } = req.body

  if(!title || !url ) return res.status(400).json({message: errorMsg[400] })

  const username = req.username

  try {

    const userFounded = await user.findOne({where: {username: username}})

    if(!userFounded) return res.status(404).json({message: errorMsg['404_user']})

    const createdVideo = await video.create({...req.body, userId: userFounded.id})

    return res.status(200).json({video:createdVideo, message: 'video uploaded succesfully'})

  } catch (error) {

    return res.status(500).json({message: errorMsg[500], error: error.message})

  }

})

module.exports = router