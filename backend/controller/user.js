const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path")
const fs = require("fs")

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../model/user");
const Review = require("../model/review");
const Hotel = require("../model/hotel");
const FoodItem = require("../model/foodItem");
const OrderTable = require('../model/orderTable')

// const transporter = require("../utils/sendmailer");
const sgMail=require("../utils/sendmailer")
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isSellerAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const { static_colors } = require("../utils/colorUtil");

router.get("/getpaypalclientdetail", isAuthenticated || isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {

        return res.status(200).json({ clientId: process.env.PAYPAL_CLIENT_ID })
    } catch {
        return res.status(401).json({ msg: "please try again later" })
    }
}))

router.get("/userinfo", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const user = req.user
        res.status(200).json({ success: true, user })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}))

router.post("/create-user", catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, phoneNumber } = req.body
    try {
        if (name && email && password && password.length >= 6) {
            const userEmail = await User.findOne({ email })
            if (userEmail) {
                return next(new ErrorHandler("User already exists", 400))
            }
            const user = {
                name, email, password, phoneNumber
            }
            const token = jwt.sign(user, process.env.ACTIVATION_TOKEN, { expiresIn: "5m" })
            // const mailOptions = {
            //     from: process.env.SMTP_MAIL,
            //     to: user.email,
            //     subject: "Account Activation",
            //     html: `<a href="http://localhost:5174/user/activation/${token}">Click on the link to activate your account</a>`
            // }
            // await transporter.sendMail(mailOptions)

            const msg = {
                to: user.email, 
                from: process.env.SMTP_MAIL, 
                subject: "Account Activation",
                html: `<a href="https://food-app-ixbg.vercel.app/user/activation/${token}">Click on the link to activate your account</a>`
              }
              await sgMail.send(msg)

            return res.status(201).json({
                success: true,
                message: `please check your email:- ${user.email} to activate your account`
            })
        }
        return next(new ErrorHandler("provide all the detils", 400))
    } catch (error) {
        console.log(error.response.body.errors)
        return next(new ErrorHandler(error.message, 400));
    }
}))

router.post('/activation', catchAsyncErrors(async (req, res, next) => {
    try {
        const token = req.body.token
        if (token) {
            const user = jwt.verify(token, process.env.ACTIVATION_TOKEN)
            if (!user) {
                return next(new ErrorHandler("Invalid token", 400));
            }
            const userExist = await User.findOne({ email: user.email })
            if (userExist) {
                return next(new ErrorHandler("User already Exists", 400))
            }
            const createuser = await User.create(user)
            return res.status(201).json({
                success: true,
                message: "User created successfully"
            })
        }
        return next(new ErrorHandler("Invalid token", 400))
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.post('/login', catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password || password.length < 6) {
            return next(new ErrorHandler("please provide all the credential", 400))
        }
        const user = await User.findOne({ email }).select("password");

        if (!user) {
            return next(new ErrorHandler("User doesn't exists", 400))
        }
        const isPasswordValid = await user.comparePass(password);
        const { password: newPassword, ...rest } = user
        if (!isPasswordValid) {
            return next(new ErrorHandler("Please provide the correct information", 400))
        }
        sendToken(user, 200, res, "logged in successfull", rest);
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.post('/setimage', isAuthenticated, upload.single('userimage'), catchAsyncErrors(async (req, res, next) => {
    try {
        const { _id } = req.user._id;
        const user = await User.findById(_id);
        if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, '../../uploads', user.avatar));
        }
        const filename = req.file.filename;

        const tempuser = await User.findByIdAndUpdate(
            { _id: _id },
            { avatar: filename },
            { new: true }
        );
        res.status(201).json({
            success: true,
            user: tempuser
        });
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
})
);

router.patch('/add-address', isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { _id } = req.user._id;
        console.log(req.user)
        if (req.user.addresses.length >= 5) {
            return next(new ErrorHandler("you can't hold more than 5 Address", 400))
        }
        const { country, state, city, address, zipCode } = req.body
        if (!country || !city || !address || !zipCode) {
            return next(new ErrorHandler("please fill all the required fields", 400))
        }
        if (zipCode.length !== 6) {
            return next(new ErrorHandler("please provide valid zipcode", 400))
        }
        const user = await User.findByIdAndUpdate(
            { _id },
            { $push: { addresses: { country, state, city, address, zipCode } } },
            { new: true })
        console.log(user)
        res.status(200).json({
            success: true,
            user: user
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.get('/colors/all-the-colors', isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        res.status(200).json({ success: true, colors: static_colors })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.patch('/colors/change-color', isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { color } = req.body
        if (!static_colors.includes(color)) {
            return next(new ErrorHandler("Invalid color", 400))
        }
        const user = await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            colors: color
        }, { new: true })
        if (!user) {
            return next(new ErrorHandler("hotel not found", 400))
        }
        res.status(200).json({ success: true, message: "color updated successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.post('/hotel/:hotelId/submit-hotel-review', isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler("hotel id is required", 400))
        }
        const { rating, comment } = req.body
        if (rating <= 0 && rating > 5) {
            return next(new ErrorHandler("rating must be between 1 and 5", 400))
        }
        if (!comment) {
            return next(new ErrorHandler("comment is required", 400))
        }
        const findRedundant = await Review.findOne({
            reviewType: "HOTEL",
            userId: req.user._id,
            reviewItemId: hotelId
        })
        if (findRedundant) {
            return next(new ErrorHandler("you have already submitted a review for this hotel", 400))
        }
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            throw new Error('Hotel not found');
        }
        const review = await Review.create({
            reviewType: "HOTEL",
            userId: req.user._id,
            reviewItemId: hotelId,
            rating,
            description: comment
        })
        const addReviewToUser = await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $push: { reviewIds: review._id }
        })
        const totalReviews = hotel.totalReview || 0;
        const currentAvgReview = hotel.avgreview || 0;
        const newAvgReview = ((currentAvgReview * totalReviews) + rating) / (totalReviews + 1);
        const updateHotelReview = await Hotel.findOneAndUpdate({
            _id: hotelId
        }, {
            $set: { avgreview: newAvgReview },
            $inc: {
                totalReview: 1,
                [`reviewCount.${rating}`]: 1
            }
        })
        res.status(200).json({ success: true, message: "review submitted successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/hotel/:hotelId/user-rating',isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {hotelId}=req.params
        if(!hotelId){
            return next(new ErrorHandler("hotel id is required", 400))
        }
        const review=await Review.findOne({
            reviewType:"HOTEL",
            userId:req.user._id,
            reviewItemId:req.params.hotelId
        }).populate("userId")
        if(!review){
            return res.status(200).json({success:false,message:"no review found for this hotel"})
            }
        res.status(200).json({success:true,review})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

router.get('/hotel/find-assigned-hotel',isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const hotels = await Promise.all(
            req.user.currentlyAssignedHotels.map(id =>
                OrderTable.findOne({ _id: id }).populate("restaurantId")
            )
        );

        res.status(200).json({success:true,hotels})
    } catch (error) {
        console.log(error.message)
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.post('/food-item/:foodItemId/submit-food-item-review',isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {foodItemId}=req.params
        if(!foodItemId){
            return next(new ErrorHandler("food id is required", 400))
        }
        const { rating, comment } = req.body
        if (rating <= 0 && rating > 5) {
            return next(new ErrorHandler("rating must be between 1 and 5", 400))
        }
        if (!comment) {
            return next(new ErrorHandler("comment is required", 400))
        }
        const findRedundant = await Review.findOne({
            reviewType: "FOOD",
            userId: req.user._id,
            reviewItemId: foodItemId
        })
        if (findRedundant) {
            return next(new ErrorHandler("you have already submitted a review for this hotel", 400))
        }
        const fooditem = await FoodItem.findById(foodItemId);
        if (!fooditem) {
            throw new Error('food item not found');
        }
        const review = await Review.create({
            reviewType: "FOOD",
            userId: req.user._id,
            reviewItemId: foodItemId,
            rating,
            description: comment
        })
        const addReviewToUser = await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $push: { reviewIds: review._id }
        })
        const totalReviews = fooditem.totalReview || 0;
        const currentAvgReview = fooditem.avgreview || 0;
        const newAvgReview = ((currentAvgReview * totalReviews) + rating) / (totalReviews + 1);
        const updateFoodReview = await FoodItem.findOneAndUpdate({
            _id: foodItemId
        }, {
            $set: { avgreview: newAvgReview },
            $inc: {
                totalReview: 1,
                [`reviewCount.${rating}`]: 1
            }
        })
        res.status(200).json({ success: true, message: "review submitted successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

router.get('/food-item/:foodItemId/user-rating',isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {foodItemId}=req.params
        if(!foodItemId){
            return next(new ErrorHandler("food id is required", 400))
        }
        const review=await Review.findOne({
            reviewType:"FOOD",
            userId:req.user._id,
            reviewItemId:foodItemId
        }).populate("userId")
        if(!review){
            return res.status(200).json({success:false,message:"no review found for this hotel"})
            }
        res.status(200).json({success:true,review})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))



module.exports = router