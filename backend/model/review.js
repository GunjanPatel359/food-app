import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    reviewType: {
        type: String,
        enum: ["HOTEL", "FOOD"],
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String
    },
    rating: {
        type: Number,
    },
    reviewItemId: {
        type: mongoose.Schema.Types.ObjectId
    }
})

module.exports = mongoose.model("Review", reviewSchema)