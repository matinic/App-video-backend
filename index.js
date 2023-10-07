const express = require('express');
const app = express();
const port = 3001;
const routes = require('./routes')
const morgan = require('morgan')
const cookieparser = require('cookie-parser')
const cors = require('cors')


app.listen(port,()=>{ 
    console.log("listen at port % " + port)
})

app.use(morgan('tiny'))

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
    ))

app.use(cookieparser())

app.use(express.json())

app.use(routes)

