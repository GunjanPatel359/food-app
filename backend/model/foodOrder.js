const mongoose=require("mongoose")

const foodOrderSchema=new mongoose.Schema({
    tableId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrderTable"
    },
    foodItemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FoodItem"
    },
    price:{
        type:Number
    },
    quantity:{
        type:Number
    },
    status:{
        type:String,
        enum:["Waiting","Preparing","Prepared","Completed"],
        default:"Waiting"
    },
    canceled:{
        type:Boolean,
        default:false
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
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

module.exports=mongoose.model("FoodOrder",foodOrderSchema)