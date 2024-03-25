const router = require('express').Router()
const {video, user} = (require('../db')).models
const auth = require('../middlewares/JWT_verifyToken')
const errorMsg = require('../errors')

//Recibir el pedido de generar un aviso en a los usuarios suscriptos en respuesta a la subida de un nuevo video
router.post('/',auth,(req,res,next)=>{  
    // se recibe toda la informacion necesaria para dar aviso a los usuarios a cerca de la novedad
    //si es un video se envia a todos los usuarios subscriptos a un determinado canal en aviso de la accion del canal al cual estan subscriptos

    //1-Buscar a todos los usuarios subscriptos a un canal
    //2-El servidor nunca inia la conexion con los usuarios
    //3-Los usuarios solicitan a la ruta a cerca de que novedades hay y reciben toda la informacion correspondiente
    //4-Determinar en donde se guardan los avisos a cerca de los movimeintos recientes
    //5-En el la tabla del canal que subio el nuevo video se almacena en una propiedad un array con los avisos que seran enviados a todos los subscriptores
})

module.exports = router