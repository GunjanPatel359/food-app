import mongoose from "mongoose"

const addOnsSchema=new mongoose.Schema({
    startingDate:{
        type:Date,
        default:Date.now()
    },
    endingDate:{
        type:Date,
    },
    active:{
        type:Boolean,
        default:true
    },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    plan:{
        type:String
    }
})

module.exports = mongoose.model("AddOn", addOnsSchema)
