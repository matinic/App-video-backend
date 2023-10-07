const router = (require('express')).Router()
const {user} = (require('../db').models)

router.get('/',async(req,res)=>{
    const cookie = req.cookies
    if(!cookie?.jwt) return res.status(204)
    const foundUser = await user.findOne({refreshToken: cookie.jwt})
    if(!foundUser){
        res.clearCookie('jwt')
        return res.status(204)
    }
    await foundUser.destroy({where: {refreshToken: cookie.jwt}})
    res.clearCookie('jwt')
    return res.status(204)
})

module.exports = router