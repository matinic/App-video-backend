const errorMsg = require('../errors')
const { video, user } = (require('../db').models)
const auth = require('../middlewares/JWT_verifyToken')

const router = (require('express')).Router()

router.put('/',auth,async(req,res)=>{

    const username = req.username
    const videoId = req.query?.id
    const option = req.query?.option

    try {
        //Checking the necessary data
        if(!videoId || !option) return res.status(400).json(errorMsg[400])
            
        //Serach for the video liked/disliked
        const videoFound = await video.findByPk(videoId)

        //Error message if the video was not found
        if(!videoFound) return res.status(404).json({message: errorMsg['404_video']})

        const userFound = await user.findOne({
            where: {
                username: username
            }
        })

        if(!userFound) return res.status(404).json({message: errorMsg['404_user']})

        const modelsMixin = {
                video: videoFound,
                user: userFound
        }
        class ArrayId{
            constructor(attribute){
                this.attribute = attribute
                Object.assign(this,modelsMixin)
            }
            async modify(action){
                if(action === 'add'){
                    this.user[this.attribute].push(this.video.id)
                }
                if(action === 'rm'){
                    const index = this.user[this.attribute].indexOf(this.video.id)
                    this.user[this.attribute].splice(index,1)
                }
                this.user.changed(this.attribute,true)
                await this.user.save()
            }
            isIncluded(){
                return this.user[this.attribute].includes(this.video.id)
            } 
        }
        class Counter{
            constructor(attribute){
                this.attribute = attribute
                Object.assign(this,modelsMixin)
            }
            async modify(action){
                if(action === 'inc') this.video[this.attribute] += 1
                if(action === 'dec') this.video[this.attribute] -= 1
                await this.video.save()
            }
        }
   
        const likedVideos = new ArrayId('likedVideos')
        const dislikedVideos = new ArrayId('dislikedVideos')
        const likeCounter = new Counter('likes')
        const dislikeCounter = new Counter('dislikes')

        const removeLike = ()=>{
            likedVideos.modify('rm')
            likeCounter.modify('dec')
        }
        const removeDislike = ()=>{
            dislikedVideos.modify('rm')
            dislikeCounter.modify('dec')
        }

        if(option === 'like'){
            if(likedVideos.isIncluded()){
                removeLike()
                return res.status(200).json({ message: 'Liked video removed' })
            }
            if(dislikedVideos.isIncluded()){
                removeDislike()
            } 
            // likedVideos.modify('add')
            likedVideos.modify("add")
            likeCounter.modify('inc')
            return res.status(200).json({message: 'Liked video added'})
        }

        if(option === 'dislike'){
            if(likedVideos.isIncluded()) {
                removeLike()
            }
            if(dislikedVideos.isIncluded()){
                removeDislike()
                return res.status(200).json({ message: 'Disliked video removed' })
            }
            dislikedVideos.modify('add')
            dislikeCounter.modify('inc')
            return res.status(200).json({ message: 'Disliked video added' })
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: errorMsg[500], error: error.message})

    }

})

module.exports = router