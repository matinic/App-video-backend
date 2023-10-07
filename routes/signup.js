require('dotenv').config()
const express = require('express')
const router = express.Router()
const createUser = require('../controllers/signup')
const errorMsg = require('../errors')

router.post('/', async function (req,res){

//Todo el codigo de validacion se puede colocar dentro de un middleware antes de entrar en la seccion del guardado del usuario en la base de datos y de devolver la respuesta final

try {
   const {body} = req;
   const {
    firstName,
    lastName,
    email,
    username,
    password,
   } = body
   
   if(!firstName || !lastName || !email || !password || !username) return res.status(400).json({message: errorMsg[400]})

///////////////////////////////////////////////////////////////////////////////////////////////////////

    const newUser = await createUser(body)

    if(!newUser) return res.status(404).json({message: `User hasn't been created`})

    res
        .status(200)
        .json({message: 'User created successfully'})

   } catch (error) {

      return res.status(500).json({message: errorMsg[500], error: error.message})
      
   }

})

module.exports = router