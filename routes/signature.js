// Require the cloudinary library
require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const router = (require('express')).Router()
const auth = require('../middlewares/JWT_verifyToken')

 
router.post('/',auth,(req,res)=>{

  const body = req?.body || {}

  const timestamp = Math.round((new Date).getTime()/1000);

  const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        ...body
      },
      process.env.API_SECRET
    );

    return res.status(200).json({timestamp,signature})
})

module.exports = router
