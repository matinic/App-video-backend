const router = (require('express')).Router()
const errorMsg = require('../errors/index.js')
const auth = require('../middlewares/JWT_verifyToken.js')
const {user,video,notification} = (require('../db')).models

router.get('/',auth,async (req,res)=>{
    try {
        const foundUser = await user.findOne({
                where: {username: req.username},
                attributes:['id','username','image','email','subscriptions','likedVideos','dislikedVideos'],
                include:[
                    {
                        model: video,
                    },
                   
                ]
            }
        ) 
    
        if(!foundUser) return res.sendStatus(404).json({message: 'User not found'})
    
        return res.status(200).json({...foundUser.dataValues, isLoggedIn: true})
        
    } catch (error) {

         return res.status(500).json({message: error.message})

    }

})


module.exports = router