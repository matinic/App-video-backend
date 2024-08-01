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
   
   if(!email || !password || !username) return res.status(400).send(errorMsg[400])

   const usernameFound = await user.findOne({where: {username}})

   if(usernameFound) return res.status(409).send('This name is already in use, please select another')

   const emailFound= await user.findOne({where: {email}})

   if(emailFound) return res.status(409).send("Email in use, please select another")

   await user.create({
      ...req.body,
      password: await bcrypt.hash(password, 8)
   })

   return res
        .status(200)
        .json({message: "User created successfully"})

   } catch (error) {

      return res.status(500).json({message: error.message})
      
   }

})

module.exports = router