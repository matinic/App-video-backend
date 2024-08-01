const router = (require('express')).Router()
const {user} = require('../db').models

router.post('/',async(req,res)=>{

    const cookie = req.cookies

    if(!cookie?.jwt) return res.sendStatus(204)

    const foundUser = await user.findOne({refreshToken: cookie.jwt})
    if(!foundUser){
        res.clearCookie('jwt',{httpOnly: true, secure: true})
        return res.sendStatus(204)
    }
    foundUser.refreshToken = null
    await foundUser.save()
    res.clearCookie('jwt',{httpOnly: true, secure: true})
    return res.sendStatus(204)
})

module.exports = router