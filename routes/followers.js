const router = require('express').Router()
const {user} = (require('../db')).models

router.get('/',async(req,res)=>{
    try{
        const username = req?.query.username
        //get the user
        const userFound = await user.findOne({ where:{username} }) 
        if(!userFound) throw new Error(errorMsg['404_user'])
        //search fo all channel subscriptions in db
        const followers = await user.findAll({
            where:{ id: userFound.followers },
            attributes:['id','image','username'],
        })
        return res.status(200).json(followers)
    }catch(error){
        if(error instanceof Error) return res.status(400).json({message: error.message})
        if(typeof error === "string") return res.status(400).json({message: error})
    }
})

module.exports = router