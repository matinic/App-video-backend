const router = require('express').Router()
const {video, user, notification, User_Notification} = (require('../db')).models
const { Op } = (require('../db'))
const auth = require('../middlewares/JWT_verifyToken')
const errorMsg = require('../errors')

//Recibir el pedido de generar un aviso en a los usuarios suscriptos en respuesta a la subida de un nuevo video
router.post('/',auth,async(req,res,next)=>{ 

try {
    
    const username = req.username

    const id = req.query.id

    if(!id) return res.status(404).json({message: errorMsg[400] })

    const videoFound = await video.findByPk(id)

    if(!videoFound) return res.status(404).json({message: errorMsg['404_video']})
   
    const userFound = await user.findOne({where: {username}})

   if(!userFound) return res.status(400).json({message: errorMsg[400] })

    const users = await user.findAll({ where:{ id: userFound.followers }})

   //Notificación para los usuarios suscriptos al canal del video subido

   const newNotification =  await notification.create({
       message: "New video uploaded by " + username,
   })
   
    users.forEach(async (user) => {
        await newNotification.addUser(user)
    })

    await newNotification.setVideo(videoFound)

    return res.status(200).json({message: 'Notification sent successfully'})
    
} catch (error) {
    return res.status(500).json({message:error})
}

})

router.get('/',auth,async(req,res)=>{
    const limit = req.query?.limit || 1
    const page = req.query?.page || 0
    try{
        const userFound = await user.findOne({
            where:{username: req.username},
            attribute: ["notifications"],
            include: {
                model: notification,
                include: [
                    {
                        where: { published: true },
                        model: video,
                        attributes: ["id","poster","title"],
                        include: [
                            {
                                model: user,
                                attributes: ['username','image'],
                            }
                        ]
                    }
                ],
                through: {
                    as: "status",
                    attributes: ['isRead'],
                },
            },
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: page * limit,
        })
        
        return  res.status(200).json({
                    notifications: userFound?.notifications.reverse()  || [],
                    nextCursor: +req.query?.page + 1
                })
    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

router.get("/count",auth,async(req,res)=>{
    try{
        const count = await user.findOne({
            where: { username: req.username },
            attributes: [],
            include: {
                model: notification,
                through:{
                    where: {isRead: false}
                },
                include: {
                    where: { published: true },
                    model: video,
                } 
            }, 
        })
        
        return  res.status(200).json({count: count?.notifications.length || 0})
    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

router.put('/',auth,async(req,res)=>{
    try{

        const userFound = await user.findOne({
            where: { username: req.username },
        })
 
        const  markedNotifications = await User_Notification.update(
            {isRead: true},
            { where:
                {
                    [Op.and]: [{userId: userFound.id }, {isRead: false}]
                }
            }
        )
        return res.status(200).json({
            notifications: "notifications updated " + markedNotifications
        })

    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

module.exports = router