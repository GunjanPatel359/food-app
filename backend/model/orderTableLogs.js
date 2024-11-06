const mongoose=require("mongoose")

const OrderTableLogsSchema=new mongoose.Schema({
    orderTableId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrderTable"
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    orderStatus:{
        type:String,
        enum:["Completed","Cancelled"],
        default:"Completed"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    orders:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"FoodOrder"
    },
    memberId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
    },
    offline:{
        type:Boolean,
        default:false
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

module.exports=mongoose.model("OrderTableLogs",OrderTableLogsSchema)