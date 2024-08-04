const mongoose=require("mongoose")

const OrderTableSchema=new mongoose.Schema({
    tableNumber:{
        type:Number,
    },
    tableDescription:{
        type:String
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    status:{
        type:String,
        enum:["Available","Occupied","Waiting","Billing"],
    },
    seats:{
        type:Number,
        default:4
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("OrderTable",OrderTableSchema)