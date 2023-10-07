const router = (require('express')).Router()

router.get('/',(req,res)=>{
    res.send('<h1>Hola desde detail</h1>')
})

module.exports = router