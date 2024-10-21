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

    socket.on("start",()=>{
      console.log("start");
    })

    socket.on("restaurant/hotel/order-tables",(hotelId)=>{
      console.log(hotelId)
      io.emit(`restaurant/${hotelId}/order-tables`)
    })

    socket.on("restaurant/hotel/order-tables/orderTableId",({hotelId,orderTableId})=>{
      console.log(orderTableId,hotelId)
      io.emit(`restaurant/${hotelId}/order-tables/${orderTableId}`)
    })

    socket.on("restaurant/hotel/orders",(hotelId)=>{
      console.log(hotelId)
      console.log("lovely")
      io.emit(`restaurant/${hotelId}/orders`)
    })

  //when disconnect
  socket.on("disconnect", () => {
    console.log(`a user disconnected!`);
  });
});

server.listen(4000, () => {
  console.log(`server is running on port ${4000}`);
});