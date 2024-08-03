const express=require("express")
const router=express.Router()
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/ErrorHandler")
const { upload } = require("../multer")
const { isSellerAuthenticated } = require("../middleware/auth")

const Role=require("../model/role")
const Member=require("../model/member")
const FoodItem=require("../model/foodItem")
const FoodCategory = require("../model/foodCategory")

router.post('/:hotelId/create-food-item',isSellerAuthenticated,upload.single('item-image'),catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler("Hotel ID is required",400))
        }
        const member=await Member.findOne({
            sellerId:req.seller._id,
            restaurantId:hotelId
        })
        if(!member) return next(new ErrorHandler("You are not the member of this restaurant",401))
        const memberRole=await Role.findOne({
            _id:member.roleId,
            restaurantId:hotelId
        })
        if(!memberRole.adminPower && !memberRole.canManageFoodItemData){
            return next(new ErrorHandler("You don't have permission to create food item",401))
        }
        const {name,description,price,veg,categoryId,foodTypes,smallDescription}=req.body
        if(!name && !description && !price && !categoryId){
            return next(new ErrorHandler("please provide all the fields",400))
        }
        let foodType=JSON.parse(foodTypes)
        console.log(foodType)
        const category=await FoodCategory.findOne({
            _id:categoryId,
            restaurantId:hotelId
        })
        const filename = req.file.filename;
        if(!category) return next(new ErrorHandler("Category not found",404))
        const fooditem=await FoodItem.create({
        name:name,
        description:description,
        price:price,
        imageUrl:filename,
        veg:veg,
        foodCategoryId:category._id,
        categoryName:category.categoryName,
        foodTypes:foodType,
        smallDescription,
        restaurantId:hotelId,
        order:category.foodItemIds.length+1
        })
        if(!fooditem){
            return next(new ErrorHandler("could not create food item",400))
        }
        category.foodItemIds.push(fooditem._id)
        const savedcategory = await category.save();
        res.status(200).json({success:true})
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message,400))
    }
}))

module.exports=router