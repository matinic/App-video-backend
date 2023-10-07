const router = (require('express')).Router()
const errorMsg = require('../errors/index.js')
const auth = require('../middlewares/JWT_verifyToken.js')
const {user,video} = (require('../db')).models

router.get('/',auth,async (req,res)=>{

    const username = req.username

    try {

        const foundUser = await user.findOne({
                where: {username: username},
                include:[{
                        model: video,
                    }]
                }
            ) 
    
        if(!foundUser) return res.sendStatus(404).json({message: 'User not found'})
    
        const userInfo = {...foundUser.dataValues}
    
        delete userInfo.password
        delete userInfo.refreshToken
    
        return res.status(200).json({userInfo})
        
    } catch (error) {

         return res.status(500).json({message: errorMsg[500], error: error.message})

    }

})

module.exports = router