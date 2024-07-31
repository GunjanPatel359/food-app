const express=require('express')
const router=express.Router()

const { isSellerAuthenticated } = require('../middleware/auth')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')

const Role = require('../model/role')
const Hotel = require('../model/hotel')
const Member = require('../model/member')
const FoodCategory = require('../model/foodCategory')

router.post('/:hotelId/create-category',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {categoryName,description}=req.body
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler("hotel id is not provided",400))
        }
        const hotel=await Hotel.findOne({
            _id:hotelId
        })
        if(!hotel){
            return next(new ErrorHandler("hotel not found",404))
        }
        if(!categoryName && !description){
            return next(new ErrorHandler("please provide all the fields",400))
        }
        const memberRole=await Member.findOne({
            restaurantId:hotelId,
            sellerId:req.seller._id
        })
        if(!memberRole){
            return next(new ErrorHandler("you are not the member of this hotel",401))
        }
        const role=await Role.findOne({
            _id:memberRole.roleId,
            restaurantId:hotelId,
        })
        if(!role.adminPower && !role.canManageFoodItemData){
            return next(new ErrorHandler("you are not authorized to create category",401))
        }
        const category=await FoodCategory.create({
            categoryName,
            description,
            restaurantId:hotelId,
            order:hotel.foodCategoryIds.length || 1
        })
        if(!category){
            return next(new ErrorHandler("category not created",500))
        }
        hotel.foodCategoryIds.push(category._id)
        const savedHotel = await hotel.save();
        res.status(200).json({success:true})
    } catch (error) {
        return next(new ErrorHandler(error,400))
    }
}))

module.exports=router