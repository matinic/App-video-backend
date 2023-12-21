const {video, user} = (require('../db')).models
const Op = (require('../db')).Op
const errorMsg = require('../errors')

const router = (require('express')).Router()

router.get('/',async(req,res)=>{
    //Look for username inside a query
    const username = req.query?.username
    const id = req.query?.id
    //If theres no one send an error message
    if(!username && !id) return res.status(400).json({message: "Missing Data"})
    try {
        //Search by username
        const userFound = await user.findOne({
            where: {username},
            attributes: ['id','username','image','followersCount'],
            include:{
                model: video,
                where:{
                    published: true
                }
            }
        })
        if(!userFound) return res.status(404).json({message: errorMsg['404_user']})
        return res.status(200).json({...userFound.dataValues})
    } catch (error) {
        return res.status(500).json({message: errorMsg[500]})
    }
})

module.exports = router