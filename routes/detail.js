const errorMsg = require('../errors')
const router = (require('express')).Router()
const {video,user} = (require('../db').models)

router.get('/',async(req,res)=>{
    
    const {id} = req.query

    if(!id) return res.status(400).json({message: errorMsg[400]})
    
    try {
        const videoFounded = await video.findByPk(id,{
            attributes: {
                exclude:['userId']
            },
            include:{
                model: user,
                attributes: ['id','image','username','followersCount']
            }
        })
        
        if(!videoFounded) return res.status(404).json({message: errorMsg['404_video']})   

        return res.status(200).json({...videoFounded.dataValues})

    } catch (error) {

        return res.status(500).json({message: errorMsg[500], error: error.msg})
        
    }
    
})

module.exports = router