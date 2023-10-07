require('dotenv').config()
const router = (require('express')).Router()
const jwt = require('jsonwebtoken')
const {accessToken} = require('../generateTokens')

router.get('/',(req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(403).json({message: 'Credetials not found'})
    jwt.verify(cookies.jwt,process.env.JWT_REFRESH,(err,decoded)=>{
        if(err){
            return res.status(403).json({message: err})
        }else{
            const newAccessToken = accessToken(decoded)
            return res.status(200).json({accessToken: newAccessToken})
        }
    })
})

module.exports = router