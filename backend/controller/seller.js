const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path")
const fs = require("fs")

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../model/user");
const Hotel = require("../model/hotel");
const Member = require("../model/member");
const Role = require("../model/role");
const Subscription = require("../model/subscription");
const SubscriptionLog = require("../model/subscriptionlog")

// const transporter = require("../utils/sendmailer");
const sgMail=require("../utils/sendmailer")
const { isSellerAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const Seller = require("../model/seller");
const { createSellerSubscription, captureSellerSubscriptionOrder } = require("../utils/paypal-api");
const { SubscriptionPlans } = require("../utils/SubscriptionPlans");
const { checkForSellerSubscription } = require("../utils/repeatQuery");
const { static_colors } = require("../utils/colorUtil");

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
            // const mailOptions = {
            //     from: process.env.SMTP_MAIL,
            //     to: seller.email,
            //     subject: "Account Activation",
            //     html: `<a href="http://localhost:5174/seller/activation/${token}">Click on the link to activate your seller account</a>`
            // }
            // await transporter.sendMail(mailOptions)

            const msg = {
                to: seller.email, 
                from: process.env.SMTP_MAIL, 
                subject: "Account Activation",
                html: `<a href="https://food-app-ixbg.vercel.app/seller/activation/${token}">Click on the link to activate your seller account</a>`
              }
              await sgMail.send(msg)

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
        const seller_token = await seller.getJwtToken()
        // const options = {
        //     expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'None' 
        // };
        res.status(200).cookie("seller_token", seller_token, {
            domain: '.vercel.app',
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }).json({
            success: true,
            message: "logged in successfully",
            seller_token
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

router.get('/getallmanaginghotels',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try{
        const member=await Member.find({
            sellerId:req.seller._id
        }).populate("restaurantId")
        if(!member){
            return next(new ErrorHandler("you are not member of any restaurant",400))
        }
        const hotels=member.map((item)=>{
            return item.restaurantId
        })
        const hotel=hotels.filter((item)=>(item.sellerId).toString() != (req.seller._id).toString())
        return res.status(200).json({success:true,hotel})
    }catch(error){
        return next(new ErrorHandler(error.message,400))
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
        console.log(err)
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
        if (seller.subscriptionIds.length < 1) {
            if (seller.restaurantIDs.length > subscriptionpack.hotelLimits) {
                return next(new ErrorHandler("You can't downgrade your subscription while you have more restaurant than subscription pack provide", 400))
            }
        } else {
            const currentSubscription = await Subscription.findOne({
                _id: seller.subscriptionIds[seller.subscriptionIds.length - 1],
                sellerId: seller._id
            })
            const currentSubscriptionpack = SubscriptionPlans.find((item) => {
                if (item.id === currentSubscription.subscriptionId) {
                    return item
                }
            })
            if (subscriptionpack.level < currentSubscriptionpack.level) {
                return next(new ErrorHandler("You can't downgrade your subscription while it's running", 400))
            }
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
            }, {
                status: "transactionCompleted"
            }, { new: true })
            const checkcurrentsellersubscriptionpack = await checkForSellerSubscription(seller)
            const subscriptionpack = SubscriptionPlans.find((item) => {
                if (item.id === subscriptionlog.subscriptionId) {
                    return item
                }
            })
            let subscription
            if (checkcurrentsellersubscriptionpack == null) {
                let enddate
                if (subscriptionpack.duration == "month") {
                    enddate = Date.now() + 86400000 * 30
                } else if (subscriptionpack.duration == "year") {
                    enddate = Date.now() + 86400000 * 365
                } else {
                    enddate = Date.now() + 86400000 * 1
                }
                subscription = await Subscription.create({
                    sellerId: seller._id,
                    orderID: jsonResponse.id,
                    active: true,
                    price: jsonResponse.purchase_units[0].payments.captures[0].value,
                    currencyCode: jsonResponse.purchase_units[0].payments.captures[0].currency_code,
                    subscriptionId: subscriptionpack.id,
                    plan: subscriptionpack.title,
                    orderLimit: subscriptionpack.orderLimit,
                    startingDate: Date.now(),
                    endingDate: enddate
                })
            } else {
                subscription = await Subscription.create({
                    sellerId: seller._id,
                    orderID: jsonResponse.id,
                    active: false,
                    price: jsonResponse.purchase_units[0].payments.captures[0].value,
                    currencyCode: jsonResponse.purchase_units[0].payments.captures[0].currency_code,
                    subscriptionId: subscriptionpack.id,
                    plan: subscriptionpack.title,
                    orderLimit: subscriptionpack.orderLimit,
                })
            }
            const sellerres = await Seller.findOneAndUpdate({
                _id: seller._id,
            }, {
                $push: { subscriptionIds: subscription._id }
            })
        }
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
})

router.get('/gethoteldata/:hotelId', isSellerAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const seller = req.seller
        const { hotelId } = req.params;
        const hotel = await Hotel.findOne({ _id: hotelId }).populate("roleIds");
        const member = await Member.findOne({
            restaurantId: hotel._id,
            sellerId: seller._id,
        })

        if (!member) {
            return next(new ErrorHandler("Unauthorized access", 401))
        }

        const role = await Role.findOne({
            _id: member.roleId,
            restaurantId: hotelId
        })

        res.status(200).json({ success: true, role, hotel, member })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
}))

router.get('/search/inviteseller',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const { query } = req.query
        if(!query || query.length <2){
            return next(new ErrorHandler("Invalid search query", 400))
        }
        const data = await Seller.find({ 
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
         });
         if(data.length>0){
            const parsingData=data.map((item)=>{
                return {
                    _id:item._id,
                    name:item.name,
                    email:item.email,
                    avatar:item.avatar
                }
            })
           return res.status(200).json({success:true,data:parsingData})
         }
         return res.status(200).json({success:false,message:"member not found"})
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message,400))
    }
}))

router.get('/search/invitesellerwithid',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const { query } = req.query
        if(!query || query.length!=24){
            return next(new ErrorHandler("Invalid search query", 400))
        }
        const data = await Seller.findOne({ 
            _id:query
         });
         if(!data){
           return res.status(200).json({success:false,message:"member not found"})
         }
         const parsingData={
            _id:data._id,
            name:data.name,
            email:data.email,
            avatar:data.avatar
         } 
         res.status(200).json({success:true,data:parsingData})
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message,400))
    }
}))

router.get('/colors/all-the-colors',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        res.status(200).json({success:true,colors:static_colors})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

router.patch('/colors/change-color',isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {color}=req.body
        if(!static_colors.includes(color)){
            return next(new ErrorHandler("Invalid color",400))
        }
        const seller=await Seller.findOneAndUpdate({
            _id:req.seller._id
        },{
            colors:color
        },{new:true})
        if(!seller){
            return next(new ErrorHandler("hotel not found",400))
        }
        res.status(200).json({success:true,message:"color updated successfully"})
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

module.exports = router
