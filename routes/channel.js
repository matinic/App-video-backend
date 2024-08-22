const {video, user} = require('../db').models

const errorMsg = require('../errors')

const router = (require('express')).Router()

router.get('/',async(req,res)=>{
    //Look for username inside a query
    const username = req.query?.username
    //If theres no one send an error message
    if(!username) throw Error("Missing Data")
    try {
        //Search by username
        const userFound = await user.findOne({
            where: { username },
            attributes: ['id','username','image','followersCount',"followers"],
            include:{
                model: video,
                required: false,
                where:{
                    published: true
                }
            }
        })
        if(!userFound) throw Error(errorMsg['404_user'])
        return res.status(200).json({...userFound.dataValues})
    } catch (error) {
        if(error instanceof Error) return res.status(404).json({message: error.message})
        if(typeof error === "string") return res.status(500).json({message: error})
    }
})

module.exports = router