const router = (require('express')).Router()
const errorMsg = require('../errors')
const auth = require('../middlewares/JWT_verifyToken')
const {video} = (require('../db')).models

router.delete('/',auth,async(req,res)=>{ 

    const {id} = req.query

    if(!id) return res.status(400).json({message: errorMsg[400]})

    try{

        const videoFound = await video.findOne({ where: { id } })

        if(!videoFound) return res.status(404).json({message: errorMsg['404_video']})

        await videoFound.destroy()

        return res.status(200).json({message: "Video deleted successfully"})

    }catch(error){

        return res.status(500).json({message: errorMsg[500], error: error.message})

    }
})

module.exports = router