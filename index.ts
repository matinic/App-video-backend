import express from "express"
import routes from "./routes/index"
const morgan = require("morgan")
const app = express();
const port = 3001;
const cookieparser = require('cookie-parser')
const cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
    }
});

const count = io.engine.clientsCount;

const count2 = io.of("/").sockets.size;

// io.on("connection",(socket)=>{
//   console.log("conexion establecida con el cliente")
//   socket.on("hola",(msg)=>{
//     console.log(msg)
//   })

// })

app.use(morgan('combined'))

app.use(cors(
    {
        // origin: 'http://localhost:5173',
        credentials: true
    }
))


app.use(cookieparser())

app.use(express.json())

app.use("/api",routes)

    

httpServer.listen(port,()=>{ 
    console.log("listen at port % " + port)
})