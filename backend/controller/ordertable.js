const express = require('express')
const router = express.Router()
const { isSellerAuthenticated, isAuthenticated } = require('../middleware/auth')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')

const Hotel = require('../model/hotel')
const Role = require('../model/role')
const OrderTable = require('../model/orderTable')
const Member = require('../model/member')
const OrderTableLogs = require('../model/orderTableLogs')
const { default: mongoose } = require('mongoose')

router.get('/:hotelId/get-all-tables', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("hotelId is missing", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller is not associated with this hotel", 400))
        }
        const hotel = await Hotel.findOne({
            _id: hotelId
        }).populate("tableIds")
        if (!hotel) {
            return next(new ErrorHandler("hotel not found", 404))
        }
        res.status(200).json({ success: true, hotel })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.post("/:hotelId/create-order-table", isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { tableNumber, tableDescription, seats } = req.body
        if (!tableNumber && !tableDescription && !seats) {
            return next(new ErrorHandler("please provide all the required fields", 400))
        }
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("hotel id is required", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller is not authenticated", 401))
        }
        const role = await Role.findOne({
            _id: member.roleId
        })
        if (!role) {
            return next(new ErrorHandler("member is not authenticated", 401))
        }
        if (!role.adminPower && !role.canManageOrderTableInfo) {
            return next(new ErrorHandler("member is not authenticated", 401))
        }
        const orderTable = await OrderTable.create({
            tableNumber,
            tableDescription,
            seats,
            restaurantId: hotelId
        })
        if (!orderTable) {
            return next(new ErrorHandler("could not create table", 400))
        }
        const hotel = await Hotel.findOneAndUpdate({
            _id: hotelId
        }, {
            $push: { tableIds: orderTable._id }
        })
        return res.status(200).json({ success: true, message: "table is created successfully" })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 404))
    }
}))

router.get('/:hotelId/get-all-available-hotels', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("hotelId is missing", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller is not associated with this hotel", 400))
        }
        const tables = await OrderTable.find({
            restaurantId: hotelId,
            status: "Available"
        })
        return res.status(200).json({ success: true, tables })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId/get-all-Occupied-hotels', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("hotelId is missing", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller is not associated with this hotel", 400))
        }
        const tables = await OrderTable.find({
            restaurantId: hotelId,
            status: "Occupied"
        })
        return res.status(200).json({ success: true, tables })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId/get-all-Billing-hotels', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("hotelId is missing", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller is not associated with this hotel", 400))
        }
        const tables = await OrderTable.find({
            restaurantId: hotelId,
            status: "Billing"
        })
        return res.status(200).json({ success: true, tables })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId/:orderTableId/get-order-table-details', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId, orderTableId } = req.params
        if (!hotelId || !orderTableId) {
            return next(new ErrorHandler("hotelId and orderTableId are missing", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller is not associated with this hotel", 400))
        }
        const orderTable = await OrderTable.findById(orderTableId).populate('restaurantId')
        if (!orderTable) {
            return next(new ErrorHandler("orderTable is not found", 400))
        }
        return res.status(200).json({ success: true, orderTableDetails: orderTable })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId/qrcode/:orderTableId/:uniqueString/:memberId', isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId, orderTableId, uniqueString, memberId } = req.params
        if (!hotelId || !orderTableId || !uniqueString || !memberId) {
            return next(new ErrorHandler("hotelId,orderTableId and memberId are missing", 400))
        }
        const table = await OrderTable.findOne({
            restaurantId: hotelId,
            _id: orderTableId,
            status: "Available"
        })
        if (!table) {
            return next(new ErrorHandler("table not found", 400))
        }
        if (table.userId) {
            return next(new ErrorHandler("table is already assigned to a user", 400))
        }
        if (table.randomString != uniqueString) {
            return next(new ErrorHandler("invalid QR code", 400))
        }
        const member = await Member.findOne({
            _id: memberId,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("member is not associated with this hotel", 400))
        }
        const assignTable = await OrderTable.findOneAndUpdate({
            _id: orderTableId,
            restaurantId: hotelId,
        }, {
            userId: req.user._id,
            status: "Occupied",
            memberId: memberId,
            randomString: 0,
            offline: false,
            orders: []
        })
        if (!assignTable) {
            return next(new ErrorHandler("table is not found", 400))
        }
        return res.status(200).json({ success: true })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId/offline-booking/:orderTableId', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId, orderTableId } = req.params
        if (!hotelId && !orderTableId) {
            return next(new ErrorHandler("hotelId and orderTableId are missing", 400))
        }
        const table = await OrderTable.findOne({
            restaurantId: hotelId,
            _id: orderTableId,
            status: "Available"
        })
        if (!table) {
            return next(new ErrorHandler("table not found", 400))
        }
        const assignTable = await OrderTable.findOneAndUpdate({
            _id: orderTableId,
            restaurantId: hotelId,
        }, {
            status: "Occupied",
            offline: true,
            orders: []
        })
        if (!assignTable) {
            return next(new ErrorHandler("table is not found", 400))
        }
        return res.status(200).json({ success: true })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId/back-to-available/:orderTableId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const { hotelId, orderTableId } = req.params
        if (!hotelId && !orderTableId) {
            return next(new ErrorHandler("hotelId and orderTableId are missing", 400))
        }
        const member=await Member.findOne({
            restaurantId:hotelId,
            sellerId:req.seller._id
        })
        if(!member){ 
            return next(new ErrorHandler("seller is not found",400))
        }
        const memberRole=await Role.findOne({
            _id:member.roleId
        })
        if(!memberRole){
            return next(new ErrorHandler("seller role is not found",400))
        }
        if(!memberRole.adminPower && !memberRole.canManageOrder){
            return next(new ErrorHandler("seller does not have permission to manage order",400))
        }
        const table = await OrderTable.findOne({
            restaurantId: hotelId,
            _id: orderTableId
        })
        if (!table) {
            return next(new ErrorHandler("table not found", 400))
        }
        if(table.status!="Available"){
            const  ordertablelog=await OrderTableLogs.create({
                orderTableId:table._id,
                restaurantId:table.restaurantId,
                userId:table?.userId,
                orders:table.orders,
                memberId:table.memberId,
                offline:table.offline,
            })
        }
        const assignTable = await OrderTable.findOneAndUpdate({
            _id: orderTableId,
            restaurantId:hotelId
        },{
            status: "Available",
            offline: false,
            randomString:Date.now(),
            orders:[],
            memberId:null,
            userId:null,
            seatCount:table.seatCount + 1
        },{new:true})
        if (!assignTable) {
            return next(new ErrorHandler("table is not found", 400))
        }
        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message,400))
    }
}))

module.exports = router