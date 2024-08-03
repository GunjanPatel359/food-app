const express= require('express');
const ErrorHandler = require('./middleware/error');
const app=express();
const cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");

const cors = require("cors")
app.use(cors({
    origin:"http://localhost:5174",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json())
app.use("/",express.static("uploads"));

//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"backend/config/.env"
    })
}

//import routes
const user=require("./controller/user");
const seller=require("./controller/seller");
const hotel=require("./controller/hotel");
const subscription=require("./controller/subscription");
const role=require("./controller/role");
const category=require("./controller/category");
const fooditem=require("./controller/fooditem");

app.use("/api/v1/user",user)
app.use("/api/v1/seller",seller)
app.use("/api/v1/restaurant",hotel)
app.use("/api/v1/subscription",subscription)
app.use("/api/v1/role",role)
app.use("/api/v1/category",category)
app.use("/api/v1/fooditem",fooditem)




app.use(ErrorHandler);

module.exports=app