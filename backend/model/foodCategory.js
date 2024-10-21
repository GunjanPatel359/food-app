const mongoose=require("mongoose")
const foodCategorySchema=new mongoose.Schema({
    categoryName:{
        type:String
    },
    // imageUrl:{
    //     type:String
    // },
    description:{
        type:String
    },
    order:{
        type:Number
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    foodItemIds:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"FoodItem"
    },
    // countOrder:{
    //     type:Number,
    // },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("FoodCategory",foodCategorySchema)