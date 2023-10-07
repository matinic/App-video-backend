const auth = require('../middlewares/JWT_verifyToken')
const {video} = (require('../db')).models
const errorMsg = require('../errors')

const router = (require('express')).Router()

router.post('/',auth, async(req,res)=>{
  const {
    name,
    userId,
    url,
  } = req.body

  if(!name || !userId || !url) return res.status(400).json({message: errorMsg[400] })

  try {

    const createdVideo = await video.create(req.body)

    return res.status(200).json({video:createdVideo, message: 'video uploaded succesfully'})

  } catch (error) {

    return res.status(500).json({message: errorMsg[500], error: error.message})

  }

})

module.exports = router