const express = require('express')
const router = express.Router()
const signupHandler = require('../handlers/signupHandler')

router.post('/',signupHandler)
router.get('/',signupHandler)

module.exports = router