import mongoose from 'mongoose'

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imgUrl:{
    type:String,
    required:true
  },
  addresses: {
    country: {
      type: String,
      required:true
    },
    city: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    zipCode: {
        type: Number,
        required:true
    }
  },
  avgreview:{
    type:Double,
  },
  // review:{
  //   type:[mongoose.Schema.Types.ObjectId],
  //   ref:'Review'
  // },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  sellerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Seller",
    required:true
  },
  cusineTypes:{
    type:[String]
  }
})

module.exports=mongoose.model("Hotel",hotelSchema)