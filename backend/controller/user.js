const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path=require("path")

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../model/user");

const transporter = require("../utils/sendmailer");
const sendToken = require("../utils/jwtToken");
const {isAuthenticated} = require("../middleware/auth");
const {upload}=require("../multer");

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
            const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: user.email,
                subject: "Account Activation",
                html: `<a href="http://localhost:5174/user/activation/${token}">Click on the link to activate your account</a>`
            }
            await transporter.sendMail(mailOptions)
            return res.status(201).json({
                success: true,
                message: `please check your email:- ${user.email} to activate your account`
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

        if (!isPasswordValid) {
            return next(new ErrorHandler("Please provide the correct information", 400))
        }
        sendToken(user, 200, res, "logged in successfull");
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.post('/setimage',isAuthenticated,upload.single('userimage'),catchAsyncErrors(async(req,res,next)=>{
    try {
        const {id}=req.user.id
        const user=await User.findById({_id:id})
        if(user.avatar){
            fs.unlinkSync(path.join(__dirname,'../../uploads',user.avatar))
        }

        const filename=req.file.filename
        const filepath=path.join(filename)
        
        const tempuser=await User.findByIdAndUpdate({_id:id},{avatar:filepath})
        res.status(201).json({
            success:true,
            user:tempuser
        })
    } catch (error) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

module.exports = router