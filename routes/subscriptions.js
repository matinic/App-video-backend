const router = require('express').Router()
const auth = require('../middlewares/JWT_verifyToken')
const {user} = (require('../db')).models

router.get('/',auth,async(req,res)=>{
    try{
        const username = req?.username
        //get the user
        const userFound = await user.findOne({ where:{username} }) 
        if(!userFound) throw new Error(errorMsg['404_user'])
        //search fo all channel subscriptions in db
        const subscriptions = await user.findAll({
            where:{ id: userFound.subscriptions },
            attributes:['id','image','username','followersCount'],
        })
        return res.status(200).json(subscriptions)
    }catch(error){
        if(error instanceof Error) return res.status(400).json({message: error.message})
        if(typeof error === "string") return res.status(400).json({message: error})
    }
})

module.exports = router


