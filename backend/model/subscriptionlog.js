const mongoose=require("mongoose")

const subscriptionLogSchema=new mongoose.Schema({
    status:{
        Enum:["subscriptionInitiated","transactionCompleted"]
    },
    orderID:{
        type:String,
    },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller"
    },
    subscriptionId:{
        type:String,
    },
    plan:{
        type:String,
        enum:["Starter","Basic","Premium"]
    },
    duration:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("SubscriptionLog", subscriptionLogSchema)