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
app.use("/",express.static("uploads"));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"backend/config/.env"
    })
}

//import routes
const user=require("./controller/user");
const seller=require("./controller/seller");

app.use("/api/v1/user",user)
app.use("/api/v1/seller",seller)




app.use(ErrorHandler);

module.exports=app