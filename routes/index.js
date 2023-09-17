const express = require('express')
const router = express.Router()
const signup = require('./signupRoute')


router.use('/signup',signup)
router.use('/signin',signup)
router.use('/profile',signup)
router.use('/create',signup)
router.use('/edit',signup)
router.use('/delete',signup)
router.use('/publish',signup)
router.use('/like',signup)
router.use('/list',signup)
router.use('/detail',signup)
router.use('/follow',signup)


module.exports = router