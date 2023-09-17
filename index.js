const express = require('express');
const app = express();
const port = 3001;
const routes = require('./routes')
const morgan = require('morgan')

app.listen(port,()=>{ 
    console.log("listen at port % " + port)
})
app.use(morgan('tiny'))

app.use(express.json())

app.use(routes)

