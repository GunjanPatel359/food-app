import mongoose from "mongoose"

const foodItemSchema=new mongoose.Schema({
    name:{
        type:String
    },
    imageUrl:{
        type:String
    },
    description:{
        type:String
    },
    veg:{
        type:Boolean
    },
    price:{
        type:Number
    },
    foodTypes:{
        type:[String]
    },
    avgreview:{
        type:Double,
    },
    order:{
       type: Number
    },
    foodCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FoodCategory"
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    // countOrder:{
    //     type:Number,
    // },
    createdAt:{
        type:Date,
        default:Date.now()
    },
})

module.exports=mongoose.model("FoodItem",foodItemSchema)