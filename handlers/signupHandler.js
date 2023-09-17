module.exports = (req,res)=>{

    if(req.method === 'GET'){
        res.send('<h1>SIGNUP END WITH GET</H1>')
    }
    if(req.method === 'POST'){
        res.send('<h1>SIGNUP END WITH POST')
    }
}