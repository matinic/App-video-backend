const {user} = (require('../db')).models

const bcrypt = require('bcrypt')

module.exports = async(nUser)=>{
    const { email, password } = nUser
    //Comprobamos si ya existe ese email
    const foundedEmail = await user.findOne({where:{email: email}})

     if(foundedEmail) return res.status(400).json('Some data already exist')

     const userCreated = await user.create({
        ...nUser,
        password: await bcrypt.hash(password, 8)
     })
    
     return userCreated
 
}