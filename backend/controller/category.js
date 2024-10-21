const express=require('express')
const router=express.Router()

const { isSellerAuthenticated } = require('../middleware/auth')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')

const Role = require('../model/role')
const Hotel = require('../model/hotel')
const Member = require('../model/member')
const FoodCategory = require('../model/foodCategory')
const FoodItem = require('../model/foodItem')

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

router.patch('/:hotelId/edit-category/:categoryId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId,categoryId}=req.params
        const {categoryName,description}=req.body
        if(!hotelId && !categoryId){
            return next(new ErrorHandler("hotel id and category id are not provided",400))
        }
        if(!categoryName && !description){
            return next(new ErrorHandler("please provide all the fields",400))
        }
        const member=await Member.findOne({
            sellerId:req.seller._id,
            restaurantId:hotelId,
        })
        if(!member){
            return next(new ErrorHandler("you are not the member of this hotel",401))
        }
        const memberRole=await Role.findOne({
            _id:member.roleId,
            restaurantId:hotelId,
        })
        if(!memberRole){
            return next(new ErrorHandler("you are not the member of this hotel",401))
        }
        if(!memberRole.adminPower && !memberRole.canManageFoodItemData){
            return next(new ErrorHandler("you are not authorized to edit category",401))
        }
        const category=await FoodCategory.findOneAndUpdate({
            _id:categoryId,
            restaurantId:hotelId
        },{categoryName,description},{new:true})
        if(!category){
            return next(new ErrorHandler("could not update category",404))
        }
        res.status(200).json({success:true,message:"category updated successfully"})
    } catch (error) {
        return next(new ErrorHandler(error.message,404))
    }
}))

router.delete('/:hotelId/:categoryId/delete-category',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try{
        const {hotelId,categoryId}=req.params
        if(!hotelId && !categoryId){
            return next(new ErrorHandler("hotel id and category id are not provided",400))
        }
        const member=await Member.findOne({
            sellerId:req.seller._id,
            restaurantId:hotelId,
        })
        if(!member){
            return next(new ErrorHandler("you are not the member of this hotel",401))
        }
        const memberRole=await Role.findOne({
            _id:member.roleId,
            restaurantId:hotelId,
        })
        if(!memberRole){
            return next(new ErrorHandler("you are not the member of this hotel",401))
        }
        if(!memberRole.adminPower && !memberRole.canManageFoodItemData){
            return next(new ErrorHandler("you are not authorized to edit category",401))
        }
        const category=await FoodCategory.findOneAndDelete({
            _id:categoryId,
            restaurantId:hotelId
        })
        if(!category){
            return next(new ErrorHandler("category not found",404))
        }
        const updateHotel=await Hotel.findOneAndUpdate({
            _id:hotelId
        },{
            $pull:{foodCategoryIds:category._id}
        })
        if(!updateHotel){
            return next(new ErrorHandler("hotel not found",404))
        }
        let itemIds=category.foodItemIds.map(async(item)=>await FoodItem.findOneAndDelete({
            _id:item,
            restaurantId:hotelId
        }))
        const deletedItems=await Promise.all(itemIds)
        console.log(deletedItems)
        res.status(200).json({success:true,message:"category deleted successfully"})
    }catch(error){
        console.log(error)
        return next(new ErrorHandler(error.message,404))
    }
}))

module.exports=router