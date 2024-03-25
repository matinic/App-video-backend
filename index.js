const express = require('express');
const app = express();
const port = 3001;
const routes = require('./routes')
const morgan = require('morgan')
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

// io.engine.on("initial_headers", (headers, req) => {
//     headers["test"] = "123";
//     headers["set-cookie"] = "mycookie=456";
//   });

// io.engine.on("headers", (headers, req) => {
//     headers["test"] = "789";
// });

// io.engine.on("initial_headers", (headers, req) => {
//     headers["test"] = "123";
//     headers["set-cookie"] = "mycookie=456";
// });

io.on("connection",(socket)=>{
  console.log("conexion establecida con el cliente")
  socket.on("hola",(msg)=>{
    console.log(msg)
  })

})


// io.engine.on("connection_error", (err) => {
//     console.log(err.req);      // the request object
//     console.log(err.code);     // the error code, for example 1
//     console.log(err.message);  // the error message, for example "Session ID unknown"
//     console.log(err.context);  // some additional error context
//   });

app.use(morgan('dev'))

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
))


app.use(cookieparser())

app.use(express.json())

app.use(routes)
    

httpServer.listen(port,()=>{ 
    console.log("listen at port % " + port)
})