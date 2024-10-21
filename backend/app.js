const express= require('express');
const ErrorHandler = require('./middleware/error');
const app=express();
const cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");
const socket=require("./utils/socket")

const cors = require("cors")
app.use(cors({
    origin: ["http://localhost:5173","https://food-app-ixbg.vercel.app"],
    credentials:true,
    methods:['GET','POST','PATCH','DELETE'],
    exposedHeaders:["set-cookie"]
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json())

if(process.env.NODE_ENV !== "PRODUCTION"){
    app.use("/",express.static("../uploads"));
}else{
    app.use("/",express.static("uploads"));
}
// socket.connect()

//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"config/.env"
    })
}

//import routes
const user=require("./controller/user");
const seller=require("./controller/seller");
const member=require("./controller/member");
const hotel=require("./controller/hotel");
const subscription=require("./controller/subscription");
const role=require("./controller/role");
const category=require("./controller/category");
const fooditem=require("./controller/fooditem");
const ordertable=require("./controller/ordertable");
const foodorder=require("./controller/foodorder")
const review=require("./controller/review")

app.use("/api/v1/user",user)
app.use("/api/v1/seller",seller)
app.use("/api/v1/restaurant",hotel)
app.use("/api/v1/member",member)
app.use("/api/v1/subscription",subscription)
app.use("/api/v1/role",role)
app.use("/api/v1/category",category)
app.use("/api/v1/fooditem",fooditem)
app.use("/api/v1/order-table",ordertable)
app.use("/api/v1/food-order",foodorder)
app.use("/api/v1/review",review)

app.use(ErrorHandler);

module.exports=app