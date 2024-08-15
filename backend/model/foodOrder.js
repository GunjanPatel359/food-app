const mongoose=require("mongoose")

const foodOrderSchema=new mongoose.Schema({
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
        enum:["Waiting","Preparing","Completed"],
        default:"waiting"
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