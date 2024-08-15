const express = require("express");
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5174",
        methods: ['GET','POST'],
        credentials:true
    }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world from socket server!");
});

io.on("connection", (socket) => {
    console.log(`a user is connected`);

    socket.on("do",()=>{
        console.log("hello")
    })

  socket.on(`order`,(orderID)=>{
    console.log("hi")
    console.log(orderID)
    io.emit(`/order/${orderID}`,"hello everyone")
  })

  //when disconnect
  socket.on("disconnect", () => {
    console.log(`a user disconnected!`);
  });
});

server.listen(4000, () => {
  console.log(`server is running on port ${4000}`);
});