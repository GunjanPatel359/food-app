const express=require('express')
const router = express.Router()
const { isSellerAuthenticated } = require('../middleware/auth')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')
const Member = require('../model/member')
const FoodOrder = require('../model/foodOrder')
const Role = require('../model/role')
const socket=require("../utils/socket")

router.patch('/:orderTableId/:foodOrderId/change-status',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {foodOrderId,orderTableId}=req.params
        if(!foodOrderId){
            return next(new ErrorHandler('Invalid food order id',400))
        }
        const member=await Member.findOne({
            sellerId:req.seller._id
        })
        if(!member){
            return next(new ErrorHandler('Seller not found',404))
        }
        const foodOrder=await FoodOrder.findOne({
            _id:foodOrderId,
            restaurantId:member.restaurantId
        })
        if(!foodOrder){
            return next(new ErrorHandler('Food order not found',404))
        }
        const memberRole=await Role.findOne({
            _id:member.roleId,
        })
        if(!memberRole){
            return next(new ErrorHandler('Member role not found',404))
        }
        if(!memberRole.adminPower && !memberRole.canManageOrder){
            return next(new ErrorHandler('You do not have permission to change order status',403))
        }
        if(foodOrder.status==='Completed'){
            return next(new ErrorHandler('Order is already Completed',403))
        }
        const forder=await FoodOrder.findOneAndUpdate({
            _id:foodOrderId   
        },{
            status:req.body.status
        })
        socket.emit("restaurant/hotel/order-tables/orderTableId",{hotelId:forder.restaurantId,orderTableId})
        res.status(200).json({success:true,message:'Order status changed successfully',})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

module.exports = router