const router = require('express').Router()
const {user} = require('../db').models
const errorMsg = require('../errors')
const auth = require('../middlewares/JWT_verifyToken')

router.get('/',auth,async(req,res)=>{
    const username = req.username
    console.log(req.query.users)
    if(!req.query?.users) return res.status(400).json({message: errorMsg[400]})
    try{
        //get the user
        const userFound = await user.findOne({ where:{username} }) 
        if(!userFound) return res.status(404).json({message: errorMsg['404_user']})
        //search fo all channel subscriptions in db
        const subsChannels = await user.findAll({
            where:{
                id:  userFound[req.query.users]
            },
            attributes:['id','image','username','followersCount'],
            limit: req?.limit,
            offset: req?.page
        })
        return res.status(200).json([...subsChannels])
    }catch(error){
        return res.status(500).json({message: errorMsg[500], error: error.message})
    }
})
module.exports = router