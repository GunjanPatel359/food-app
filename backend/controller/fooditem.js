const express = require("express")
const router = express.Router()
const fs=require('fs')
const path=require('path')

const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/ErrorHandler")
const { upload } = require("../multer")
const { isSellerAuthenticated, isAuthenticated } = require("../middleware/auth")

const Role = require("../model/role")
const Member = require("../model/member")
const FoodItem = require("../model/foodItem")
const FoodCategory = require("../model/foodCategory")

router.post('/:hotelId/create-food-item', isSellerAuthenticated, upload.single('item-image'), catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("Hotel ID is required", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) return next(new ErrorHandler("You are not the member of this restaurant", 401))
        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        })
        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            return next(new ErrorHandler("You don't have permission to create food item", 401))
        }
        const { name, description, price, veg, categoryId, foodTypes, smallDescription } = req.body
        if (!name && !description && !price && !categoryId) {
            return next(new ErrorHandler("please provide all the fields", 400))
        }
        let foodType = JSON.parse(foodTypes)
        console.log(foodType)
        const category = await FoodCategory.findOne({
            _id: categoryId,
            restaurantId: hotelId
        })
        const filename = req.file.filename;
        if (!category) return next(new ErrorHandler("Category not found", 404))
        const fooditem = await FoodItem.create({
            name: name,
            description: description,
            price: price,
            imageUrl: filename,
            veg: veg,
            foodCategoryId: category._id,
            categoryName: category.categoryName,
            foodTypes: foodType,
            smallDescription,
            restaurantId: hotelId,
            order: category.foodItemIds.length + 1
        })
        if (!fooditem) {
            return next(new ErrorHandler("could not create food item", 400))
        }
        category.foodItemIds.push(fooditem._id)
        const savedcategory = await category.save();
        res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.patch('/:hotelId/:foodItemId/update-item-without-image', isSellerAuthenticated, upload.single('item-image'), catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId,foodItemId } = req.params
        if (!hotelId && !foodItemId) {
            return next(new ErrorHandler("Hotel ID is required", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) return next(new ErrorHandler("You are not the member of this restaurant", 401))
        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        })
        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            return next(new ErrorHandler("You don't have permission to update food item", 401))
        }
        const { name, description, price, veg, categoryId, foodTypes, smallDescription } = req.body
        if (!name && !description && !price && !categoryId) {
            return next(new ErrorHandler("please provide all the fields", 400))
        }
        let foodType = JSON.parse(foodTypes)
        const category = await FoodCategory.findOne({
            _id: categoryId,
            restaurantId: hotelId
        })
        if (!category) return next(new ErrorHandler("Category not found", 404))
        const fooditem = await FoodItem.findOneAndUpdate({
            _id:foodItemId,
            restaurantId: hotelId,
            foodCategoryId:category._id
        },{
            name: name,
            description: description,
            price: price,
            veg: veg,
            categoryName: category.categoryName,
            foodTypes: foodType,
            smallDescription,
        }, { new: false })
        if (!fooditem) {
            return next(new ErrorHandler("could not update food item", 400))
        }
        res.status(200).json({ success: true , message:"item updated successfully" })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 404))
    }
}))

router.patch('/:hotelId/:foodItemId/update-item-with-image', isSellerAuthenticated, upload.single('item-image'), catchAsyncErrors(async (req, res, next) => {
    try {
        const filename = req.file.filename;
        if (!filename) {
            return next(new ErrorHandler("Please upload an image", 400))
        }
        const { hotelId,foodItemId } = req.params
        if (!hotelId && !foodItemId) {
            return next(new ErrorHandler("Hotel ID is required", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) return next(new ErrorHandler("You are not the member of this restaurant", 401))
        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        })
        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            return next(new ErrorHandler("You don't have permission to update food item", 401))
        }
        const { name, description, price, veg, categoryId, foodTypes, smallDescription } = req.body
        if (!name && !description && !price && !categoryId) {
            return next(new ErrorHandler("please provide all the fields", 400))
        }
        let foodType = JSON.parse(foodTypes)
        const category = await FoodCategory.findOne({
            _id: categoryId,
            restaurantId: hotelId
        })
        if (!category) return next(new ErrorHandler("Category not found", 404))
        const fooditem = await FoodItem.findOneAndUpdate({
            _id:foodItemId,
            restaurantId: hotelId,
            foodCategoryId:category._id
        },{
            name: name,
            description: description,
            price: price,
            imageUrl: filename,
            veg: veg,
            categoryName: category.categoryName,
            foodTypes: foodType,
            smallDescription,
        }, { new: false })
        if (!fooditem) {
            fs.unlinkSync(path.join(__dirname, '../../uploads',filename))
            return next(new ErrorHandler("could not update food item", 400))
        }
        fs.unlinkSync(path.join(__dirname, '../../uploads',fooditem.imageUrl))
        res.status(200).json({ success: true , message:"item updated successfully" })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 404))
    }
}))

router.delete('/:hotelId/delete-food-item/:foodItemId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId,foodItemId}=req.params
        if(!hotelId && !foodItemId){
            return next(new ErrorHandler("Please provide hotel id and food item id", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) return next(new ErrorHandler("You are not the member of this restaurant", 401))
        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        })
        if (!memberRole.adminPower && !memberRole.canManageFoodItemData) {
            return next(new ErrorHandler("You don't have permission to create food item", 401))
        }
        const fooditem=await FoodItem.findOneAndDelete({
            _id:foodItemId,
            restaurantId:hotelId
        })
        if(!fooditem){
            return next(new ErrorHandler("could not delete food item", 400))
        }
        const foodcategory=await FoodCategory.findOneAndUpdate({
            _id:fooditem.foodCategoryId
        },{
            $pull:{foodItemIds:fooditem._id}
        })
        res.status(200).json({success:true,message:"deleted item successfully"})
    } catch (error) {
        return next(new ErrorHandler(error.message))
    }
}))

router.get('/getallfood/:hotelId',catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler("Please provide hotel id", 400))
        }
        const fooditems=await FoodCategory.find({restaurantId:hotelId}).populate("foodItemIds")
        if(fooditems.length<=0){
            return next(new ErrorHandler("No food items found", 404))
        }
        res.status(200).json({success:true,food:fooditems})
    } catch (error) {
        return next(new ErrorHandler(error.message))
    }
}))

router.get('/getfooditem/table-user/:foodItemId',isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {foodItemId}=req.params
        if(!foodItemId){
            return next(new ErrorHandler("food id is missing", 400))
        }
        const fooditem=await FoodItem.findOne({_id:foodItemId})
        if(!fooditem){
            return next(new ErrorHandler("food item not found", 404))
        }
        return res.status(200).json({success:true,fooditem})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

router.get('/:foodItemId/get-food-item',catchAsyncErrors(async(req,res,next)=>{
    try {
        const {foodItemId}=req.params
        if(!foodItemId){
            return next(new ErrorHandler("Please provide food item id", 400))
        }
        const fooditem=await FoodItem.findOne({_id:foodItemId})
        res.status(200).json({success:true,fooditem})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

module.exports = router