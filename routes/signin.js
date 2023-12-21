require('dotenv').config()
const {user} = (require('../db')).models
const bcrypt = require('bcrypt')
const { refreshToken, accessToken } = require('../generateTokens')
const errorMsg = require('../errors')

const router = (require('express')).Router()

router.post('/',async(req,res)=>{
    try {

        const {username, password} = req.body

        if(!username || !password) return res.status(400).json({message: errorMsg[400]})
  
        const userData = await user.findOne({where:{username:username}})

        if(!userData) return res.status(404).json({message: 'User not found'})
        
        const verifyPass = await bcrypt.compare(password,userData.password)
      
        if(verifyPass){
         
            const newRefreshToken = refreshToken(userData)
           
            const newAccessToken = accessToken(userData)

            await userData.update({refreshToken: newRefreshToken})

            res
            .status(200)
            .cookie('jwt',newRefreshToken,{maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: true})
            .json({message:'User Logged Successfully', isLoggedIn: true, accessToken: newAccessToken})

        }else{

           return res.status(404).json({message:'username or password are incorrect'})
           
        }
        
    } catch (error){

       return res.sendStatus(500).json({message: errorMsg[500], error: error.message})

    }

})

module.exports = router