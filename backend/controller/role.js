const express=require('express')
const router=express.Router()
const { isSellerAuthenticated } = require('../middleware/auth')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utils/ErrorHandler')

const Member = require('../model/member')
const Role = require('../model/role')
const Hotel = require('../model/hotel')

router.get('/roleinfo/:roleId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {roleId}=req.params
        if(!roleId){
            return next(new ErrorHandler("role id is not provided",401))
        }
        const role=await Role.findOne({
            _id:roleId
        })
        if(!role){
            return next(new ErrorHandler("role do not exists",400))
        }
        const member=await Member.findOne({
            sellerId:req.seller._id,
            restaurantId:role.restaurantId
        })
        if(!member){
            return next(new ErrorHandler("you are not a member of this restaurant",401))
        }
        const memberRole=await Role.findOne({
            _id:member.roleId
        })
        if(!memberRole){
            return next(new ErrorHandler("member role not found",401))
        }
        if(!memberRole.canManageRoles && !memberRole.adminPower){
            return next(new ErrorHandler("you do not have permission to view this role",401))
        }
        if(memberRole.order>role.order){
            return next(new ErrorHandler("you do not have permission to view this role",401))
        }
        res.status(200).json({success:true,role})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))
///////////////////////////roles////////////////////////
router.post('/create-role/:hotelId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const seller=req.seller;
        const { hotelId } = req.params;
        const {
            roleName,
            roleDescription,
            canUpdateRestaurantImg,
            canUpdateRestaurantDetails,
            canManageRoles,
            adminPower,
            canAddMember
        }=req.body
        if(!hotelId){
            return next(new ErrorHandler("hotel id is not given"))
        }
        if(roleName=="Owner" || roleName=="owner"){
            return next(new ErrorHandler("cannot name role to owner",401))
        }
        const member=await Member.findOne({
            sellerId:seller._id,
            restaurantId:hotelId
        })
        if(!member){
            return next(new ErrorHandler("Unauthorized",401))
        }
        const role=await Role.findOne({
            _id:member.roleId,
            restaurantId:hotelId,
        })
        if(!role){
            return next(new ErrorHandler("Unauthorized",401))
        }
        const hotel=await Hotel.findOne({
            _id:hotelId
        })
        let newRole
        if(role.adminPower){
            newRole=await Role.create({
                restaurantId:hotelId,
                roleName,
                roleDescription,
                canUpdateRestaurantImg,
                canUpdateRestaurantDetails,
                canAddMember,
                canManageRoles,
                order:hotel.roleIds.length + 1,
                adminPower
            })
        }else if(role.canManageRoles){
            newRole=await Role.create({
                restaurantId:hotelId,
                roleName,
                roleDescription,
                canUpdateRestaurantImg,
                canUpdateRestaurantDetails,
                canAddMember,
                order:hotel.roleIds.length + 1,
                canManageRoles,
            })
        }else{
            return next(new ErrorHandler("you Do not have permission to create roles"))
        }
        if(!newRole){
            return next(new ErrorHandler("Failed to create role",500))
        }
        const newhotel=await Hotel.findOneAndUpdate({
            _id:hotelId
        },{
            $push:{
                roleIds:newRole._id
                }
        })
        res.status(201).json({success:true,role:newRole})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))
///////////////////////////roles////////////////////////
router.post('/edit-role/:roleId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    const {roleId}=req.params
    const {
        roleName,
        roleDescription,
        canUpdateRestaurantImg,
        canUpdateRestaurantDetails,
        canManageRoles,
        adminPower,
        canManageFoodItemData,
        canAddMember
    }=req.body
    if(!roleId){
        return next(new ErrorHandler("role id is not given"))
    }
    const role=await Role.findOne({
        _id:roleId,
    })
    if(!role){
        return next(new ErrorHandler("role do not exist",401))
    }
    const member=await Member.findOne({
        sellerId:req.seller._id,
        restaurantId:role.restaurantId
    })
    const memberRole=await Role.findOne({
        _id:member.roleId,
    })
    if(role.roleName=="Owner"){
        return next(new ErrorHandler("you cannot edit owner role",401))
    }
    let newRole
    if(memberRole.roleName=="Owner"||memberRole.order==1){
        newRole=await Role.findOneAndUpdate({
            _id:roleId
        },{
            roleName,
            roleDescription,
            canUpdateRestaurantImg,
            canUpdateRestaurantDetails,
            canManageRoles,
            adminPower,
            canManageFoodItemData,
            canAddMember
        },{
            new:true
        })
        return res.status(200).json({success:true,message:"role updated successfully"})
    }
    if(!memberRole.canManageRoles && !memberRole.adminPower){
        return next(new ErrorHandler("you do not have permission to edit this role",401))
    }
    if(memberRole.order<role.order){
        if(role.adminPower){
            newRole=await Role.findOneAndUpdate({
                _id:roleId
            },{
                roleName,
                roleDescription,
                canUpdateRestaurantImg,
                canUpdateRestaurantDetails,
                canManageRoles,
                adminPower,
                canManageFoodItemData,
                canAddMember
            },{
                new:true
            })
        }else{
            newRole=await Role.findOneAndUpdate({
                _id:roleId
            },{
                roleName,
                roleDescription,
                canUpdateRestaurantImg,
                canUpdateRestaurantDetails,
                canManageRoles,
                canManageFoodItemData,
                canAddMember
            },{
                new:true
            })
        }
    }else{
        return next(new ErrorHandler("you cannot update this role",401))
    }
    res.status(200).json({success:true,message:"role updated successfully"})
}))

router.post('/reorder-roles/:hotelId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const seller=req.seller
        const { hotelId } = req.params;

        const member=await Member.findOne({
            sellerId:seller._id,
            restaurantId:hotelId
        })
        if(!member){
            return next(new ErrorHandler("Unauthorized",401))
        }
        const role=await Role.findOneAndUpdate({
            memberList:member._id,
            restaurantId:hotelId,
        })
        if(!role){
            return next(new ErrorHandler("Unauthorized",401))
        }
        if(!role.canManageRoles && !role.canAddMember){
            return next(new ErrorHandler("you Do not have permission to reorder roles"))
        }
        const {
            roles
        }=req.body
        const hotel=await Hotel.findOne({_id:hotelId}).populate("roleIds")
        let backroles=hotel.roleIds

        var checkingAllRolesPresense=[]
        var checkingAllBackRolesPresense=[]
        roles.map((item)=>{
            checkingAllRolesPresense.push(item._id)
        })
        backroles.map((item)=>{
            checkingAllBackRolesPresense.push(item._id)
        })

        const allArePresense=JSON.stringify(checkingAllRolesPresense.sort()) === JSON.stringify(checkingAllBackRolesPresense.sort())
        if(!allArePresense){
            return next(new ErrorHandler("you can not reorder roles"))
        }

        let updates = [];
        backroles=backroles.sort((a,b)=>a.order - b.order)
        for(i=0;i<hotel.roleIds.length;i++){
            if(role.order>backroles[i].order){
                if(backroles[i].order!=roles[i].order){
                    return next(new ErrorHandler("cannot change higher order",400))
                }
            }else{
                updates.push({
                    updateOne: {
                    filter: { _id: roles[i]._id },
                    update: { order: i+1 }
                    }
                });   
            }
        }

        if (updates.length > 0) {
            try {
              const result = await Role.bulkWrite(updates);
              console.log(result)
              return res.status(201).json({success:true,message:"reordered successfully"})
            } catch (error) {
              console.log(error);
              return next(new ErrorHandler('Error updating roles', 500));
            }
          } 

    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message,400))
    }
}))

router.get('/memberrole-info/:hotelId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler("hotelId is not provided",400))
        }
        const member=await Member.findOne({
            restaurantId:hotelId,
            sellerId:req.seller._id
        })
        if(!member){
            return next(new ErrorHandler("seller is not a member of this hotel",400))
        }
        const role=await Role.findOne({
            _id:member.roleId
        })
        if(!role){
            return next(new ErrorHandler("role not found",400))
        }
        res.status(200).json({success:true,role})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

///////////////////////////roles////////////////////////
router.delete('/:hotelId/:roleId/delete-role',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId,roleId}=req.params
        if(!hotelId && !roleId){
            return next(new ErrorHandler("hotelId is not provided",400))
        }
        const member=await Member.findOne({
            restaurantId:hotelId,
            sellerId:req.seller._id
        })
        if(!member){
            return next(new ErrorHandler("seller is not a member of this hotel",400))
        }
        const memberRole=await Role.findOne({
            _id:member.roleId,
            restaurantId:hotelId
        })
        if(!memberRole){
            return next(new ErrorHandler("seller is not a member of this hotel",400))
        }
        let role=await Role.findOne({
            _id:roleId
        })
        if(!role){
            return next(new ErrorHandler("role not found",400))
        }
        if(!role.roleName=="Owner" && !role.order==1){
            return next(new ErrorHandler("you are not authorized to delete this role",400))
        }
        if(role.order<=memberRole.order){
        return next(new ErrorHandler("you are not authorized to delete this role",400))
        }
        if(!memberRole.adminPower && !memberRole.canAddMember){
            return next(new ErrorHandler("you are not authorized to delete this role",400))
        }
        const deletedmembers=role.memberList.map((item)=>
            Member.deleteOne({_id:item._id})
        )
        const deletingmember=await Promise.all(deletedmembers)
        const deletingRole=await Role.deleteOne({
            _id:roleId
        })
        res.status(200).json({success:true,message:"role deleted successfully"})
    } catch (error) {
        return next(new ErrorHandler(error.message,404))
    }
}))

module.exports=router