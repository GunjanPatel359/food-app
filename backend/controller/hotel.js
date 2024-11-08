const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const { upload } = require('../multer')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const { isSellerAuthenticated } = require('../middleware/auth')

const Hotel = require('../model/hotel')
const Seller = require('../model/seller')
const Role = require('../model/role')
const Member = require('../model/member')
const Subscription = require('../model/subscription')
const FoodItem = require('../model/foodItem')
const FoodCategory = require('../model/foodCategory')
const Review = require('../model/review')

const { checkForSellerSubscription } = require("../utils/repeatQuery")
const { static_colors } = require("../utils/colorUtil")

router.get('/restaurant-get-home', catchAsyncErrors(async (req, res, next) => {
    try {
        const hotel = await Hotel.find({}).limit(5)
        res.status(200).json({ success: true, hotel })
    } catch (error) {
        return next(new ErrorHandler(error.message))
    }
}))

router.get('/food-item-get-home', catchAsyncErrors(async (req, res, next) => {
    try {
        const fooditem = await FoodItem.find({}).populate("restaurantId").limit(5)
        res.status(200).json({ success: true, fooditem })
    } catch {
        return next(new ErrorHandler(error.message))
    }
}))

router.post('/create-restaurant', isSellerAuthenticated, upload.single('restaurantimage'), catchAsyncErrors(async (req, res, next) => {
    try {
        let sellerinfo = req.seller;

        const { name, country, state, city, address, zipCode, cusineTypes } = req.body

        let subscription = await checkForSellerSubscription(sellerinfo)
        if (subscription == null) {
            return next(new ErrorHandler('You do not have any active plan to continue with', 400))
        }
        if (sellerinfo.restaurantIDs.length >= subscription.hotelLimit) {
            return next(new ErrorHandler(`You cannot create more than ${subscription.hotelLimit} restaurant`))
        }

        const addresses = { country, state, city, address, zipCode }
        const filename = req.file.filename;
        let hotel = await Hotel.create({
            name,
            imgUrl: filename,
            addresses,
            cusineTypes,
            sellerId: sellerinfo._id
        })
        if (!hotel) {
            return next(new ErrorHandler('Something went wrong', 400))
        }

        let role = await Role.create({
            sellerId: sellerinfo._id,
            restaurantId: hotel._id,
            roleName: "Owner",
            order: 1,
            roleDescription: "Owner",
            canUpdateRestaurantImg: true,
            canUpdateRestaurantDetails: true,
            adminPower: true,
            canAddMember: true
        })

        hotel = await Hotel.findOneAndUpdate({
            _id: hotel._id,
        }, {
            $push: { roleIds: role._id }
        })

        const member = await Member.create({
            sellerId: sellerinfo._id,
            restaurantId: hotel._id,
            roleId: role._id
        })

        role = await Role.findOneAndUpdate({
            _id: role._id
        }, {
            $push: { memberList: member._id }
        })

        const seller = await Seller.findOneAndUpdate({
            _id: sellerinfo._id
        }, {
            $push: { restaurantIDs: hotel._id }
        }, { new: true })


        res.status(200).json({ success: true, seller })

    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
}))

router.post('/updateImage/:hotelId', isSellerAuthenticated, upload.single('updateHotelImage'), catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params;
        if (!hotelId) {
            return next(new ErrorHandler("hotel Id not found", 400))
        }
        const { _id } = req.seller._id
        const hotel = await Hotel.findOne({
            _id: hotelId,
            sellerId: _id
        })
        if (!hotel) {
            return next(new ErrorHandler("hotel not found", 400))
        }
        fs.unlinkSync(path.join(__dirname, '../../uploads', hotel.imgUrl))
        const filename = req.file.filename;
        hotel.imgUrl = filename;
        await hotel.save()
        res.status(200).json({ success: true, filename })
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.get('/:hotelId/food-items-with-categories', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("hotel Id not found", 400))
        }
        const member = await Member.findOne({
            restaurantId: hotelId,
            sellerId: req.seller._id
        })
        if (!member) {
            return next(new ErrorHandler("You are not member of this hotel", 400))
        }
        const category = await FoodCategory.find({
            restaurantId: hotelId
        }).populate("foodItemIds")
        return res.status(200).json({ success: true, category })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/:hotelId', catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("hotel Id not found", 400))
        }
        const hotel = await Hotel.findById(hotelId)
        if (!hotel) {
            return next(new ErrorHandler("hotel not found", 400))
        }
        res.status(200).json({ success: true, hotel })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/hotel/colors', catchAsyncErrors(async (req, res, next) => {
    try {
        res.status(200).json({ success: true, colors: static_colors })
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.patch('/:hotelId/change-color', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        const { color } = req.body
        if (!static_colors.includes(color)) {
            return next(new ErrorHandler("Invalid color", 400))
        }
        if (!hotelId && color.length != 6) {
            return next(new ErrorHandler("hotel Id and color not found", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller not found", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        })
        if (!memberRole) {
            return next(new ErrorHandler("you are not member of this hotel", 400))
        }
        if (!memberRole.adminPower) {
            return next(new ErrorHandler("you do not have permission to do changes", 400))
        }
        const hotel = await Hotel.findOneAndUpdate({
            _id: hotelId
        }, {
            colors: color
        }, { new: true })
        if (!hotel) {
            return next(new ErrorHandler("hotel not found", 400))
        }
        res.status(200).json({ success: true, message: "color updated successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/restaurants/search-restaurants/search', catchAsyncErrors(async (req, res, next) => {
    try {
        const { minrate, mintotalrate, search, page = 1, limit = 10 } = req.query;

        let ratingCondition = {};
        if (minrate) {
            const minRate = parseFloat(minrate) || 0;
            ratingCondition = { avgreview: { $gte: minRate } };
        }

        let totalRatingCondition = {};
        if (mintotalrate) {
            const minTotalRate = parseInt(mintotalrate) || 0;
            totalRatingCondition = { totalReview: { $gte: minTotalRate } };
        }

        // search query

        let searchQuery = {};
        if (search) {
            searchQuery = { name: { $regex: search, $options: 'i' } }
        }

        const queryConditions = {
            ...searchQuery,
            ...ratingCondition,
            ...totalRatingCondition
        };

        let skip = (parseInt(page) - 1) * parseInt(limit);
        if (skip < 0) {
            skip = 0
        }
        const hotel = await Hotel.find(queryConditions)
            .limit(parseInt(limit))
            .skip(skip);;

        res.status(200).json({ success: true, hotel });

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}));

router.get('/food-items/search-food-items/search', catchAsyncErrors(async (req, res, next) => {
    try {
        const { minrate, mintotalrate, search, minPrice = 0, maxPrice, page = 1, limit = 10 } = req.query;
        console.log(minrate, mintotalrate, search, minPrice, maxPrice, page, limit);

        // Minimum average rating
        let ratingCondition = {};
        if (minrate) {
            const minRate = parseFloat(minrate) || 0;
            ratingCondition = { avgreview: { $gte: minRate } };
        }

        // Minimum total reviews
        let totalRatingCondition = {};
        if (mintotalrate) {
            const minTotalRate = parseInt(mintotalrate) || 0;
            totalRatingCondition = { totalReview: { $gte: minTotalRate } };
        }

        // Search query
        let searchQuery = {};
        if (search) {
            searchQuery = { name: { $regex: search, $options: 'i' } };
        }

        // Price range condition (optional)
        let priceCondition = {};
        if (minPrice || maxPrice) {
            priceCondition.price = {};
            if (minPrice) priceCondition.price.$gte = parseFloat(minPrice);
            if (maxPrice) priceCondition.price.$lte = parseFloat(maxPrice);
        }

        // Combine all conditions
        const queryConditions = {
            ...searchQuery,
            ...ratingCondition,
            ...totalRatingCondition,
            ...priceCondition,
        };

        // Calculate skip and limit for pagination
        let skip = (parseInt(page) - 1) * parseInt(limit);
        if (skip < 0) {
            skip = 0
        }
        const fooditem = await FoodItem.find(queryConditions)
            .limit(parseInt(limit))
            .skip(skip);

        // Send response with pagination data
        res.status(200).json({
            success: true,
            fooditem,
            // pagination: {
            //     currentPage: parseInt(page),
            //     itemsPerPage: parseInt(limit),
            //     totalItems: await FoodItem.countDocuments(queryConditions)
            // }
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.patch('/update-tax-data/:hotelId', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        const { gstCharge, serviceCharge } = req.body
        const parsedGstCharge = parseFloat(gstCharge);
        const parsedServiceCharge = parseFloat(serviceCharge);

        if (isNaN(parsedGstCharge) || isNaN(parsedServiceCharge)) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid numerical values for GST Charge and Service Charge."
            });
        }

        if (!hotelId) {
            return next(new ErrorHandler("hotel Id not found", 400))
        }
        const member = await Member.findOne({
            sellerId: req.seller._id,
            restaurantId: hotelId
        })
        if (!member) {
            return next(new ErrorHandler("seller not found", 400))
        }
        const memberRole = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        })
        if (!memberRole) {
            return next(new ErrorHandler("you are not member of this hotel", 400))
        }
        if (!memberRole.adminPower) {
            return next(new ErrorHandler("you do not have permission to do changes", 400))
        }
        const hotel = await Hotel.findOneAndUpdate({
            _id: hotelId,
        }, {
            hotelGSTTax: parsedGstCharge,
            hotelServiceTax: parsedServiceCharge
        }, { new: true })
        res.status(200).json({ success: true, hotel })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

module.exports = router