const express = require("express")
const router = express.Router()
const { isSellerAuthenticated } = require("../middleware/auth")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/ErrorHandler")

const Role = require("../model/role")
const Member = require("../model/member")
const Seller = require("../model/seller")

router.get('/:roleId/:hotelId/membersWithDetails', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { roleId, hotelId } = req.params
        if (!roleId && !hotelId) {
            return next(new ErrorHandler("all the parameters are not the present", 400))
        }
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: req.seller._id
        })
        if (!member) {
            return next(new ErrorHandler("seller is not the member of the hotel", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId
        })
        if (!memberRole) {
            return next(new ErrorHandler("unAuthorized access", 400))
        }
        if (!memberRole.adminPower && !memberRole.canAddMember) {
            return next(new ErrorHandler("you do not have permission to invite members", 400))
        }
        const role = await Role.findOne({
            _id: roleId,
            restaurantId: hotelId
        }).populate("memberList")
        if (!role) {
            return next(new ErrorHandler("role is not the member of the hotel", 400))
        }
        const members = role.memberList.map((item) => {
            return Seller.findOne({_id:item.sellerId})
        })
        const roleMembers=await Promise.all(members)
        res.status(200).json({ success: true,roleMembers,roleId:role._id })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 404))
    }
}))

router.get('/:roleId/:hotelId/members-sellerid', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { roleId, hotelId } = req.params
        if (!roleId && !hotelId) {
            return next(new ErrorHandler("all the parameters are not the present", 400))
        }
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: req.seller._id
        })
        if (!member) {
            return next(new ErrorHandler("seller is not the member of the hotel", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId
        })
        if (!memberRole) {
            return next(new ErrorHandler("unAuthorized access", 400))
        }
        if (!memberRole.adminPower && !memberRole.canAddMember) {
            return next(new ErrorHandler("you do not have permission to invite members", 400))
        }
        const role = await Role.findOne({
            _id: roleId,
            restaurantId: hotelId
        }).populate("memberList")
        if (!role) {
            return next(new ErrorHandler("role is not the member of the hotel", 400))
        }
        const members = role.memberList.map((item) => {
            return item.sellerId
        })
        res.status(200).json({ success: true, members })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 404))
    }
}))

router.post('/:hotelId/add-members', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        const {roleId,sellerId}=req.body
        if (!roleId && !hotelId && !sellerId) {
            return next(new ErrorHandler("all the parameters are not the present", 400))
        }
        if(sellerId==req.seller._id){
            return next(new ErrorHandler("you can not add yourself", 400))
        }
        const roleCheck=await Role.findOne({
            _id:roleId,
        })
        if(roleCheck.order==1 || roleCheck.roleName=="Owner"){
            return next(new ErrorHandler("you can not add members to this role", 400))
        }
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: req.seller._id
        })
        if (!member) {
            return next(new ErrorHandler("you are not the member of the hotel", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId
        })
        if (!memberRole) {
            return next(new ErrorHandler("unAuthorized access", 400))
        }
        if (!memberRole.adminPower && !memberRole.canAddMember && memberRole.order>=roleCheck.order) {
            return next(new ErrorHandler("you do not have permission to invite members", 400))
        }
        const addingMember = await Member.findOne({
            sellerId: sellerId,
            restaurantId: hotelId
        }).populate("roleId")
        let newMember
        if (!addingMember) {
            newMember = await Member.create({
                sellerId: sellerId,
                roleId: roleId,
                restaurantId: hotelId
            })
            const role = await Role.findOneAndUpdate({
                _id: roleId,
            }, {
                $push: { memberList: newMember._id }
            })
            return res.status(200).json({ success: true, message: "member added successfully" })
        }
        if(addingMember.roleId.roleName == "Owner" || addingMember.roleId.order == 1){
            return next(new ErrorHandler("you can not add owner to this role", 400))
        }
        if (addingMember.roleId == roleId) {
            return res.status(200).json({ success: true, message: "member is already added" })
        }
        if(addingMember.order<=memberRole.order){
            return next(new ErrorHandler("you can not add member with higher order than you", 400))
        }
        const oldRole = await Role.findOneAndUpdate({
            _id: addingMember.roleId
        }, {
            $pull: { memberList: addingMember._id }
        })
        const newRole = await Role.findOneAndUpdate({
            _id: roleId
        }, {
            $push: { memberList: addingMember._id }
        })
        const updateMemberRole=await Member.findOneAndUpdate({
            _id:addingMember._id
        },{
            roleId:newRole._id
        })
        return res.status(200).json({success:true,message:"member added successfully"})
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 404))
    }
}))

router.post('/remove-member/:hotelId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const { hotelId } = req.params
        const {roleId,sellerId}=req.body
        if (!roleId && !hotelId && !sellerId) {
            return next(new ErrorHandler("all the parameters are not the present", 400))
        }
        const roleCheck=await Role.findOne({
            _id:roleId,
        })
        if(roleCheck.order==1 || roleCheck.roleName=="Owner"){
            return next(new ErrorHandler("you can not remove member to this role", 400))
        }
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: req.seller._id
        })
        if (!member) {
            return next(new ErrorHandler("you are not the member of the hotel", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId
        })
        if (!memberRole) {
            return next(new ErrorHandler("unAuthorized access", 400))
        }
        if (!memberRole.adminPower && !memberRole.canAddMember) {
            return next(new ErrorHandler("you do not have permission to remove members", 400))
        }
        const removingMember = await Member.findOne({
            sellerId: sellerId,
            restaurantId: hotelId
        }).populate("roleId")
        if(!removingMember){
            return res.status(200).json({success:true,message:"member is not part of this restaurant"})
        }
        const updateRole=await Role.findOneAndUpdate({
            _id:removingMember.roleId._id
        },{
            $pull:{memberList:removingMember._id}
        })
        const deletingMember=await Member.findOneAndDelete({
            _id:removingMember._id
        })
        res.status(200).json({success:true,message:"member is removed successfully"})
    } catch (error) {
        console.log(error.message)
        return next(new ErrorHandler(error.message,404))
    }
}))

router.get('/:hotelId/ismember',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler("hotel id is not provided",400))
        }
        const member = await Member.findOne({
            sellerId:req.seller._id,
            restaurantId:hotelId
        })
        if(!member){
            return next(new ErrorHandler("you are not the member of the hotel",400))
        }
        res.status(200).json({success:true,data:true})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

router.get('/:hotelId/member-of-hotel',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler("hotel id is not provided",400))
        }
        const member = await Member.findOne({
            sellerId:req.seller._id,
            restaurantId:hotelId
        })
        if(!member){
            return next(new ErrorHandler("you are not the member of the hotel",400))
        }
        const memberRole=await Role.findOne({
            _id:member.roleId,
            restaurantId:hotelId
        })
        if(!memberRole){
            return next(new ErrorHandler("member role is not found",400))
        }
        if(!memberRole.adminPower && !memberRole.canManageOrder){
            return next(new ErrorHandler("you are not authorized to access this route",400))
        }
        res.status(200).json({success:true,data:member._id})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

module.exports = router