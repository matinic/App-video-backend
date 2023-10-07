require('dotenv').config()
const jwt = require('jsonwebtoken')

async function auth(req,res,next){
  const header = req.headers['authorization']
  if(!header) return res.sendStatus(401)
  const token = header.split(' ')[1]
  const decodedToken = function (){
    return new Promise((resolve,reject)=>{
      jwt.verify(token,process.env.JWT_ACCESS,(err,decoded)=>{
        if(err){
          reject(err)
        }else{
          resolve(decoded)
        }
      })
    })
  }
  try {
  const decoded = await decodedToken()
    if(decoded){
      req.username = decoded.username
      next() 
    }
  } catch (error) {
   return res.status(403).json({message: error.message})
  }
}
 
module.exports = auth