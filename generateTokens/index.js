require('dotenv').config()
const jwt = require('jsonwebtoken')

function refreshToken(user){
    const token = jwt.sign({
       username: user.username,
    }, process.env.JWT_REFRESH,{
        expiresIn: '1d'
    })
    return token
}
function accessToken(user){
    const token = jwt.sign({
       username: user.username,
    }, process.env.JWT_ACCESS,{
        expiresIn: '15m'
    })
    return token
}
module.exports = {
    refreshToken,
    accessToken,
}

