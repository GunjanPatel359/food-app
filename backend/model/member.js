const mongoose=require("mongoose")

const memberSchema=new mongoose.Schema({
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role"
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    }
})

module.exports = mongoose.model("Member", memberSchema)