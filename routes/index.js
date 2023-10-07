const express = require('express')
const router = express.Router()

const fs = require('fs')

let handlers = {}
let files = fs.readdirSync('./routes')

files.forEach(file => {
    const key = file.slice(0,-3)
    if(key !== 'index') handlers[key] = require(`./${key}`)
})
for(let path in handlers){
    router.use(`/${path}`,handlers[path])
}

module.exports = router