const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path=require("path")

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../model/user");

const transporter = require("../utils/sendmailer");
const { isSellerAuthenticated} = require("../middleware/auth");
const {upload}=require("../multer");
const Seller = require("../model/seller");

router.get("/sellerinfo",isSellerAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const seller=req.seller
        res.status(200).json({seller})
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}))

router.post("/create-seller", catchAsyncErrors(async (req, res, next) => {
    const { name, email, password} = req.body
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
        const seller = await Seller.findOne({ email }).select("password");

        if (!seller) {
            return next(new ErrorHandler("Seller doesn't exists", 400))
        }
        const isPasswordValid = await seller.comparePass(password);

        if (!isPasswordValid) {
            return next(new ErrorHandler("Please provide the correct information", 400))
        }
        const token=await seller.getJwtToken()
        const options={
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly:true    
        };
        res.status(200).cookie("seller_token",token,options).json({
            success:true,
            message:"logged in successfully",
            token
        })
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.post('/setimage',isSellerAuthenticated,upload.single('sellerimage'),catchAsyncErrors(async(req,res,next)=>{
    try {
        const {id}=req.seller._id
        const seller=await Seller.findById({_id:id})
        if(seller.avatar){
            fs.unlinkSync(path.join(__dirname,'../../uploads',seller.avatar))
        }

        const filename=req.file.filename
        const filepath=path.join(filename)
        
        const tempseller=await Seller.findByIdAndUpdate({_id:id},{avatar:filepath})
        res.status(201).json({
            success:true,
            seller:tempseller
        })
    } catch (error) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

module.exports = router