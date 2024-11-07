const express = require('express')
const router = express.Router()
const { isSellerAuthenticated, isAuthenticated } = require('../middleware/auth')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')

const User = require('../model/user')
const Hotel = require('../model/hotel')
const Role = require('../model/role')
const OrderTable = require('../model/orderTable')
const Member = require('../model/member')
const OrderTableLogs = require('../model/orderTableLogs')
const FoodItem = require('../model/foodItem')
const FoodOrder = require('../model/foodOrder')

const socket=require('../utils/socket')

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

router.get('/:hotelId/:foodOrderId/order-tabel-food-item', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId, foodOrderId } = req.params
        if (!hotelId || !foodOrderId) {
            return next(new ErrorHandler("hotelId and food order id are missing", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller is not associated with this hotel", 400))
        }
        const fooditem = await FoodOrder.findById(foodOrderId).populate("foodItemId")
        if (!fooditem) {
            return next(new ErrorHandler("orderTable is not found", 400))
        }
        return res.status(200).json({ success: true, fooditem })
    } catch (error) {
        console.log(error)
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
        const orderTable = await OrderTable.findById(orderTableId).populate('restaurantId').populate({ path: "orders", populate: { path: "foodItemId" } })
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
            _id: orderTableId
        })
        if (!table) {
            return next(new ErrorHandler("table not found", 400))
        }
        if(table.userId){
            if((table.userId).toString()==(req.user._id).toString()){
                return res.status(200).json({success:true,message:"you already have accquire the table"})
            }
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
        const user = await User.findOneAndUpdate({
            _id: req.user._id
        },{
            $push: { currentlyAssignedHotels: orderTableId }
        })
        return res.status(200).json({ success: true,message:'table accquired' })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId/:orderTableId/get-user-table-details',isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const { hotelId, orderTableId } = req.params
        if (!hotelId || !orderTableId) {
            return next(new ErrorHandler("hotelId and orderTableId are missing", 400))
        }
        const orderTable=await OrderTable.findOne({
            _id:orderTableId,
            restaurantId:hotelId,
            userId:req.user._id
        }).populate('restaurantId').populate({ path: "orders", populate: { path: "foodItemId" } })
        if(!orderTable){
            return next(new ErrorHandler("table is not assigned to you",400))
        }
        return res.status(200).json({success:true,orderTableDetails:orderTable})
    } catch (error) {
        return  next(new ErrorHandler(error.message, 400))
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
        socket.emit("restaurant/hotel/order-tables",hotelId)
        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId/back-to-available/:orderTableId', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId, orderTableId } = req.params
        if (!hotelId && !orderTableId) {
            return next(new ErrorHandler("hotelId and orderTableId are missing", 400))
        }
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: req.seller._id
        })
        if (!member) {
            return next(new ErrorHandler("seller is not found", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId
        })
        if (!memberRole) {
            return next(new ErrorHandler("seller role is not found", 400))
        }
        if (!memberRole.adminPower && !memberRole.canManageOrder) {
            return next(new ErrorHandler("seller does not have permission to manage order", 400))
        }
        const table = await OrderTable.findOne({
            restaurantId: hotelId,
            _id: orderTableId
        })
        if (!table) {
            return next(new ErrorHandler("table not found", 400))
        }
        const hotel=await Hotel.findOne({
            _id:hotelId
        })
        if(!hotel){
            return next(new ErrorHandler("hotel not found", 400))
        }
        if(hotel.orderCancelCount>=hotel.orderCancelLimit){
            return next(new ErrorHandler("hotel order cancel limit reached", 400))
        }
        hotel.orderCancelCount += 1;
        await hotel.save();
        if (table.status != "Available") {
            const ordertablelog = await OrderTableLogs.create({
                orderTableId: table._id,
                restaurantId: table.restaurantId,
                userId: table?.userId,
                orders: table.orders,
                memberId: table.memberId,
                offline: table.offline,
                orderStatus: "Cancelled"
            })
        }
        const assignTable = await OrderTable.findOneAndUpdate({
            _id: orderTableId,
            restaurantId: hotelId
        }, {
            status: "Available",
            offline: false,
            randomString: Date.now(),
            orders: [],
            memberId: null,
            userId: null,
            seatCount: table.seatCount + 1
        },{new:false})
        if (!assignTable) {
            return next(new ErrorHandler("table is not found", 400))
        }
        const user = await User.findOneAndUpdate({
            _id: assignTable.userId,
        },{
            $pull:{currentlyAssignedHotels:assignTable._id}
        })
        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId/get-all-tables-order', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("hotelId are missing", 400))
        }
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: req.seller._id
        })
        if (!member) {
            return next(new ErrorHandler("seller is not found", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId
        })
        if (!memberRole) {
            return next(new ErrorHandler("seller role is not found", 400))
        }
        // const table = await OrderTable.find({
        //     restaurantId: hotelId,
        // }).populate({ path: 'orders', populate: { path: 'foodItemId' } })
        const table = await OrderTable.find({
            restaurantId: hotelId,
        })
        // console.log(table)
        if (!table) {
            return next(new ErrorHandler("no order found", 400))
        }
        return res.status(200).json({ success: true, table })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.post('/:hotelId/food-item-order/:orderTableId', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId, orderTableId } = req.params
        if (!hotelId && !orderTableId) {
            return next(new ErrorHandler("hotelId and orderTableId are missing", 400))
        }
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: req.seller._id
        })
        if (!member) {
            return next(new ErrorHandler("seller is not found", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId
        })
        if (!memberRole) {
            return next(new ErrorHandler("seller role is not found", 400))
        }
        const ordertable = OrderTable.findOne({
            _id: orderTableId,
            restaurantId: hotelId
        })
        if (!ordertable) {
            return next(new ErrorHandler("order table is not found", 400))
        }
        if (ordertable.status == "Available") {
            return next(new ErrorHandler("table has no customer", 400))
        }
        if (!memberRole.adminPower && !memberRole.canManageOrder) {
            return next(new ErrorHandler("seller does not have permission to manage order", 400))
        }
        const orders = req.body.order
        const checkOrder = orders.map(async (item) => {
            try {
                const foodItem = await FoodItem.findOne({
                    _id: item.item._id,
                    restaurantId: hotelId
                });
                return foodItem;
            } catch (error) {
                return next(new ErrorHandler("fooditem not found", 400))
            }
        });
        var result
        await Promise.all(checkOrder)
            .then(values => {
                result = values.map((item) => {
                    if (item == null) {
                        return next(new ErrorHandler("food item is not found", 400))
                    }
                    return item
                });
            })
            .catch(error => {
                return next(new ErrorHandler("An error occurred during food item retrieval", 400))
            });
        const orderfood = orders.map((item) => {
            return FoodOrder.create({
                foodItemId: item.item._id,
                restaurantId: hotelId,
                price: result.find((temp) => { if (item.item._id == temp._id) return temp }).price,
                quantity: item.quantity
            })
        })
        var createdItems
        await Promise.all(orderfood).then(values => {
            createdItems = values.map(item => item._id)
        }).catch(error => {
            return next(new ErrorHandler("An error occurred during order food creation", 400))
        })
        const table = await OrderTable.findOneAndUpdate({
            _id: orderTableId
        }, {
            $push: { "orders": createdItems }
        })
        if (table == null) {
            return next(new ErrorHandler("table not found", 400))
        }
        return res.status(200).json({ success: true, message: "order created successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.post('/:hotelId/user-order/:orderTableId',isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const { hotelId, orderTableId } = req.params
        if (!hotelId && !orderTableId) {
            return next(new ErrorHandler("hotelId and orderTableId are missing", 400))
        }
        const ordertable = OrderTable.findOne({
            _id: orderTableId,
            restaurantId: hotelId,
            userId:req.user._id,
        })
        if (!ordertable) {
            return next(new ErrorHandler("order table is not found", 400))
        }
        const orders = req.body.order
        const checkOrder = orders.map(async (item) => {
            try {
                const foodItem = await FoodItem.findOne({
                    _id: item.item._id,
                    restaurantId: hotelId
                });
                return foodItem;
            } catch (error) {
                return next(new ErrorHandler("fooditem not found", 400))
            }
        });
        var result
        await Promise.all(checkOrder)
            .then(values => {
                result = values.map((item) => {
                    if (item == null) {
                        return next(new ErrorHandler("food item is not found", 400))
                    }
                    return item
                });
            })
            .catch(error => {
                return next(new ErrorHandler("An error occurred during food item retrieval", 400))
            });
        const orderfood = orders.map((item) => {
            return FoodOrder.create({
                foodItemId: item.item._id,
                restaurantId: hotelId,
                price: result.find((temp) => { if (item.item._id == temp._id) return temp }).price,
                quantity: item.quantity
            })
        })
        var createdItems
        await Promise.all(orderfood).then(values => {
            createdItems = values.map(item => item._id)
        }).catch(error => {
            return next(new ErrorHandler("An error occurred during order food creation", 400))
        })
        const table = await OrderTable.findOneAndUpdate({
            _id: orderTableId
        }, {
            $push: { "orders": createdItems }
        })
        if (table == null) {
            return next(new ErrorHandler("table not found", 400))
        }
        return res.status(200).json({ success: true, message: "order created successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

router.patch('/:hotelId/update-order-table/:orderTableId', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId, orderTableId } = req.params
        if (!hotelId && !orderTableId) {
            return next(new ErrorHandler("hotel id and order table id are required", 400))
        }
        const { tableNumber, tableDescription, seats } = req.body
        if (!tableNumber && !tableDescription && !seats) {
            return next(new ErrorHandler("table number, table description and seats are required", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller is not a member of this restaurant", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId
        })
        if (!memberRole) {
            return next(new ErrorHandler("seller role not found", 400))
        }
        if (!memberRole.adminPower && !memberRole.canManageOrderTableInfo) {
            return next(new ErrorHandler("seller does not have permission to update order table info", 400))
        }
        const orderTable = await OrderTable.findOneAndUpdate({
            _id: orderTableId,
            restaurantId: hotelId
        }, {
            tableNumber: tableNumber,
            tableDescription: tableDescription,
            seats: seats
        })
        if (!orderTable) {
            return next(new ErrorHandler("order table not found", 400))
        }
        return res.status(200).json({ success: true, message: "order table updated successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.delete('/:hotelId/delete-order-table/:orderTableId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try{
        const { hotelId, orderTableId } = req.params
        if (!hotelId && !orderTableId) {
            return next(new ErrorHandler("hotel id and order table id are required", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller is not a member of this restaurant", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId
        })
        if (!memberRole) {
            return next(new ErrorHandler("seller role not found", 400))
        }
        if (!memberRole.adminPower && !memberRole.canManageOrderTableInfo) {
            return next(new ErrorHandler("seller does not have permission to update order table info", 400))
        }
        const orderTable = await OrderTable.findOneAndDelete({
            _id: orderTableId,
            restaurantId: hotelId
        })
        if (!orderTable) {
            return next(new ErrorHandler("order table not found", 400))
        }
        return res.status(200).json({ success: true, message: "order table deleted successfully" })
    }catch(error){
        return next(new ErrorHandler(error.message,400))
    }
}))

module.exports = router