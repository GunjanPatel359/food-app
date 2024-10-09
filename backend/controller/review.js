const express = require("express");
const router = express.Router();

const User=require("../model/user")
const Review=require("../model/review")

const jwt = require("jsonwebtoken");

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

router.get('/hotel/:hotelId/public-review',catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler('Hotel ID is required',400))
        }
        const {token}=req.cookies
        if(token){
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
            const user=await User.findById(decoded.id)
            if(user){
                const review=await Review.find({
                    reviewItemId:hotelId,
                    reviewType:"HOTEL",
                    userId: { $ne: user._id }
                }).populate("userId").limit(3)
                return res.status(200).json({success:true,reviews:review})
            }
        }
        const reviews=await Review.find({
            reviewItemId:hotelId,
            reviewType:"HOTEL"
        }).populate("userId").limit(3)
        res.status(200).json({success:true,reviews})
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message,400))
    }
}))

router.get('/food-item/:foodItemId/public-review',catchAsyncErrors(async(req,res,next)=>{
    try {
        const {foodItemId}=req.params
        if(!foodItemId){
            return next(new ErrorHandler('food id is required',400))
        }
        const {token}=req.cookies
        if(token){
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
            const user=await User.findById(decoded.id)
            if(user){
                const review=await Review.find({
                    reviewItemId:foodItemId,
                    reviewType:"FOOD",
                    userId: { $ne: user._id }
                }).populate("userId").limit(3)
                return res.status(200).json({success:true,reviews:review})
            }
        }
        const reviews=await Review.find({
            reviewItemId:foodItemId,
            reviewType:"FOOD"
        }).populate("userId").limit(3)
        res.status(200).json({success:true,reviews})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

module.exports = router