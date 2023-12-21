require('dotenv').config()
const express = require('express')
const router = express.Router()
const errorMsg = require('../errors')
const {user} = (require('../db')).models
const bcrypt = require('bcrypt')

router.post('/', async function (req,res){

try {
   const {
    email,
    username,
    password,
   } = req.body
   
   if(!email || !password || !username) return res.status(400).json({message: errorMsg[400]})

   const usernameFounded = await user.findOne({where: {username: username}})

   if(usernameFounded) return res.status(409).json({message: 'This name is already in use, please select another'})

   const emailFounded = await user.findOne({where: {email : email}})

   if(emailFounded) return res.status(409).json({message: "Email in use, please select another"})

   await user.create({
      ...req.body,
      password: await bcrypt.hash(password, 8)
   })

    res
        .status(200)
        .json({message: 'User created successfully'})

   } catch (error) {

      return res.status(500).json({message: errorMsg[500], error: error.message})
      
   }

})

module.exports = router