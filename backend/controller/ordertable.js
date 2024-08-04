const express=require('express')
const router=express.Router()
const { isSellerAuthenticated } = require('../middleware/auth')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')

const Hotel=require('../model/hotel')
const Role=require('../model/role')
const OrderTable = require('../model/orderTable')
const Member = require('../model/member')

router.get('/:hotelId/get-all-tables',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler("hotelId is missing",400))
        }
        const member=await Member.findOne({
            sellerId:req.seller._id,
            restaurantId:hotelId
        })
        if(!member){
            return next(new ErrorHandler("seller is not associated with this hotel",400))
        }
        const hotel=await Hotel.findOne({
            _id:hotelId
        }).populate("tableIds")
        if(!hotel){
            return next(new ErrorHandler("hotel not found",404))
        }
        res.status(200).json({success:true,hotel})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

router.post("/:hotelId/create-order-table",isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {tableNumber,tableDescription,seats}=req.body
        if(!tableNumber && !tableDescription && !seats){
            return next(new ErrorHandler("please provide all the required fields",400))
        }
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler("hotel id is required",400))
        }
        const member=await Member.findOne({
            sellerId:req.seller._id,
            restaurantId:hotelId
        })
        if(!member){
            return next(new ErrorHandler("seller is not authenticated",401))
        }
        const role=await Role.findOne({
            _id:member.roleId
        })
        if(!role){
            return next(new ErrorHandler("member is not authenticated",401))
        }
        if(!role.adminPower && !role.canManageOrderTableInfo){
            return next(new ErrorHandler("member is not authenticated",401))
        }
        const orderTable=await OrderTable.create({
            tableNumber,
            tableDescription,
            seats,
            restaurantId:hotelId
        })
        if(!orderTable){
            return next(new ErrorHandler("could not create table",400))
        }
        const hotel=await Hotel.findOneAndUpdate({
            _id:hotelId
        },{
            $push:{tableIds:orderTable._id}
        })
        return res.status(200).json({success:true,message:"table is created successfully"})
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message,404))
    }
}))

module.exports=router