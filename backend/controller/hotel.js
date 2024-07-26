const express = require('express')
const router = express.Router()
const fs=require('fs')
const path = require('path')

const { upload } = require('../multer')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const { isSellerAuthenticated, isRestaurantSellerAuthenticated } = require('../middleware/auth')

const Hotel = require('../model/hotel')
const Seller = require('../model/seller')
const Subscription = require('../model/subscription')

router.post('/create-restaurant', isSellerAuthenticated, upload.single('restaurantimage'), catchAsyncErrors(async (req, res, next) => {
    try {
        const {
            name,
            country,
            state,
            city,
            address,
            zipCode,
            cusineTypes
        } = req.body
        const subscription=await Subscription.findOne({
            sellerId:req.seller._id,
            active:true
        })
        const addresses = {
            country,
            state,
            city,
            address,
            zipCode
        }
        const filename = req.file.filename;
        const hotel = await Hotel.create({
            name,
            imgUrl: filename,
            addresses,
            cusineTypes,
            sellerId: req.seller._id
        })
        if (!hotel) {
            return next(new Error('Something went wrong',400))
        }
        const seller = await Seller.findOneAndUpdate({
            _id: req.seller._id
        }, {
            $push: { restaurantIDs: hotel._id }
        }, { new: true })
        res.status(200).json({ success: true, seller })
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
}))

router.post('/updateImage/:hotelId',isSellerAuthenticated, upload.single('updateHotelImage'),catchAsyncErrors(async (req,res,next)=>{
    try {
        const {hotelId}=req.params;
        if(!hotelId){
            return next(new ErrorHandler("hotel Id not found",400))
        }
        const {_id}=req.seller._id
        const hotel=await Hotel.findOne({
            _id:hotelId,
            sellerId:_id
        })
        if(!hotel){
            return next(new ErrorHandler("hotel not found",400))
        }
        fs.unlinkSync(path.join(__dirname, '../../uploads',hotel.imgUrl))
        const filename = req.file.filename;
        hotel.imgUrl=filename;
        await hotel.save()
        res.status(200).json({success:true,filename})
    } catch (err) {
        return next(new ErrorHandler(err.message,400))
    }
}))

module.exports = router