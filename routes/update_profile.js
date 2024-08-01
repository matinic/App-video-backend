const router = (require('express')).Router()
const errorMsg = require('../errors/index.js')
const auth = require('../middlewares/JWT_verifyToken.js')
const {user} = (require('../db')).models

router.put('/',auth, async(req,res)=>{
    console.log(req.username)
    try {
        const userFound = await user.findOne({where:{username: req.username }})
        if(!userFound) res.status(200).json({message: errorMsg['404_user']})
        userFound.set({
            ...req.body
        })
        await userFound.save()
        return res.status(200).json({ message: 'User updated successfully'})
    } catch (error) {
        return res.status(500).json({messsage: errorMsg[500]})
    }
})

module.exports = router