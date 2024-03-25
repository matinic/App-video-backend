// Require the cloudinary library
require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const router = (require('express')).Router()

function getSignature (req,res){
    
    let body

    if(req.method === 'GET')  body = {}
    if(req.method === 'POST')  body = req?.body || {}

    const timestamp = Math.round((new Date).getTime()/1000);

    const signature = cloudinary.utils.api_sign_request(
        {
          timestamp: timestamp,
          ...body
        },
        process.env.API_SECRET
      );

      return res.status(200).json({timestamp,signature})
}

router.get('/',getSignature)
router.post('/',getSignature)

module.exports = router
