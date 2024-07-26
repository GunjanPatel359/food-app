const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path")
const fs = require("fs")

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../model/user");
const Hotel = require("../model/hotel");
const Subscription = require("../model/subscription");
const SubscriptionLog = require("../model/subscriptionlog")

const transporter = require("../utils/sendmailer");
const { isSellerAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const Seller = require("../model/seller");
const { createSellerSubscription, captureSellerSubscriptionOrder } = require("../utils/paypal-api");
const { SubscriptionPlans } = require("../utils/SubscriptionPlans");

router.get("/sellerinfo", isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const seller = req.seller
        res.status(200).json({ seller })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}))

router.post("/create-seller", catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        if (name && email && password && password.length >= 6) {
            const sellerEmail = await Seller.findOne({ email })
            if (sellerEmail) {
                return next(new ErrorHandler("User already exists", 400))
            }
            const seller = {
                name, email, password,
            }
            const token = jwt.sign(seller, process.env.ACTIVATION_TOKEN, { expiresIn: "5m" })
            const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: seller.email,
                subject: "Account Activation",
                html: `<a href="http://localhost:5174/seller/activation/${token}">Click on the link to activate your seller account</a>`
            }
            await transporter.sendMail(mailOptions)
            return res.status(201).json({
                success: true,
                message: `please check your email:- ${seller.email} to activate your seller account`
            })
        }
        return next(new ErrorHandler("provide all the detils", 400))
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}))

router.post('/activation', catchAsyncErrors(async (req, res, next) => {
    try {
        const token = req.body.token
        if (token) {
            const seller = jwt.verify(token, process.env.ACTIVATION_TOKEN)
            if (!seller) {
                return next(new ErrorHandler("Invalid token", 400));
            }
            const sellerExist = await Seller.findOne({ email: seller.email })
            if (sellerExist) {
                return next(new ErrorHandler("Seller already Exists", 400))
            }
            const createseller = await Seller.create(seller)
            return res.status(201).json({
                success: true,
                message: "Seller created successfully"
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
        let seller = await Seller.findOne({ email }).select("password");
        console.log(seller)
        if (!seller) {
            return next(new ErrorHandler("Seller doesn't exists", 400))
        }
        const isPasswordValid = await seller.comparePass(password);

        if (!isPasswordValid) {
            return next(new ErrorHandler("Please provide the correct information", 400))
        }
        const token = await seller.getJwtToken()
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };
        res.status(200).cookie("seller_token", token, options).json({
            success: true,
            message: "logged in successfully",
            token
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.post('/setimage', isSellerAuthenticated, upload.single('sellerimage'), catchAsyncErrors(async (req, res, next) => {
    try {
        const { _id } = req.seller._id
        const seller = await Seller.findById({ _id: _id })
        if (seller.avatar) {
            fs.unlinkSync(path.join(__dirname, '../../uploads', seller.avatar))
        }
        const filename = req.file.filename
        const filepath = path.join(filename)
        console.log(filepath)

        const tempseller = await Seller.findOneAndUpdate({ _id: _id }, { avatar: filepath }, { new: true })
        res.status(201).json({
            success: true,
            seller: tempseller
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.get('/getallsellerhotels', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { _id } = req.seller._id
        const seller = await Seller.findById({ _id: _id }).populate('restaurantIDs')
        res.status(200).json({
            success: true,
            hotel: seller.restaurantIDs
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.get('/getsellerhotel/:hotelId', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { _id } = req.seller._id
        const { hotelId } = req.params
        if (!hotelId) {
            return next(new ErrorHandler('hotelId not found', 400))
        }
        const hotel = await Hotel.findOne({
            _id: hotelId,
            sellerId: _id
        })
        if (!hotel) {
            return next(new ErrorHandler('hotel not found', 400))
        }
        res.status(200).json({ success: true, hotel })
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.patch('/updaterestaurantinfo/:hotelId', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { _id } = req.seller._id
        const { hotelId } = req.params
        const { name, country, city, state, address, zipCode } = req.body
        var { cusineTypes } = req.body
        cusineTypes = cusineTypes.filter((item) => {
            if (item !== "") {
                return item
            }
        })
        const hotel = await Hotel.findOneAndUpdate({
            _id: hotelId,
            sellerId: _id
        }, {
            name: name,
            'addresses.country': country,
            'addresses.city': city,
            'addresses.state': state,
            'addresses.address': address,
            'addresses.zipCode': zipCode,
            cusineTypes
        }, { new: true })
        if (!hotel) {
            return next(new ErrorHandler("hotel not found", 400))
        }
        return res.status(200).json({ success: true, hotel })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

// router.delete('/deleterestaurant/:hotelId',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
//     try {
//         const {hotelId}=req.params
//         if(!hotelId){
//             return next(new ErrorHandler('hotelId not found',400))
//         }
//         const {_id}=req.seller._id
//         const hotel=await Hotel.findOneAndDelete({
//             _id:hotelId,
//             sellerId:_id
//         })
//         fs.unlinkSync(path.join(__dirname,'../../uploads',hotel.imgUrl))
//         if(!hotel){
//             return next(new ErrorHandler("UnAuthorized",400))
//         }
//         const seller=await Seller.findOneAndUpdate({
//             _id:_id
//         },{
//             $pull:{restaurantIDs:hotelId}
//         },{new:true})
//         return res.status(200).json({success:true,seller})
//     } catch (error) {
//         return next(new ErrorHandler(error.message,400))
//     }
// }))

router.post('/subscription', async (req, res, next) => {
    try {
        const { subscription } = req.body;
        const { seller } = req.body
        const subscriptionpack = SubscriptionPlans.find((item) => {
            if (item.id === subscription.id) {
                return item
            }
        })
        if (!subscriptionpack) {
            return next(new ErrorHandler("subscription not found", 400))
        }
        const { jsonResponse, httpStatusCode } = await createSellerSubscription(subscriptionpack);
        const subscriptionlog = await SubscriptionLog.create({
            orderID: jsonResponse.id,
            sellerId: seller._id,
            subscriptionId: subscriptionpack.id,
            plan: subscriptionpack.title,
            status: "subscriptionInitiated"
        })
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
})

router.post('/subscription/:orderID', async (req, res, next) => {
    try {
        const { orderID } = req.params;
        const { seller } = req.body;
        const { jsonResponse, httpStatusCode } = await captureSellerSubscriptionOrder(orderID);
        if (jsonResponse.status == 'COMPLETED') {
            const subscriptionlog = await SubscriptionLog.findOneAndUpdate({
                orderID: orderID,
                sellerId: seller._id
            },{
                status: "subscriptionCompleted"
            },{new:true})
            const subscriptionpack = SubscriptionPlans.find((item) => {
                if (item.id === subscriptionlog.subscriptionId) {
                    return item
                }
            })
            let enddate
            if(subscriptionpack.duration=="month"){
                enddate=Date.now() + 86400000 * 30
            }else if(subscriptionpack.duration=="year"){
                enddate=Date.now() + 86400000 * 365
            }else{
                enddate=Date.now() + 86400000 * 1
            }
            const subscription = await Subscription.create({
                sellerId: seller._id,
                orderID: jsonResponse.id,
                price: jsonResponse.purchase_units[0].payments.captures[0].value,
                currencyCode: jsonResponse.purchase_units[0].payments.captures[0].currency_code,
                subscriptionId:subscriptionpack.id,
                plan: subscriptionpack.title,
                orderLimit:subscriptionpack.orderLimit,
                startingDate: Date.now(),
                endingDate: enddate
            })
            const sellerres=await Seller.findOneAndUpdate({
                _id:seller._id,
            },{
                $push:{subscriptionIds:subscription._id}
            })
        }
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
})

module.exports = router
