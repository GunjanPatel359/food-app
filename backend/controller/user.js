const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path=require("path")
const fs=require("fs")

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../model/user");

const transporter = require("../utils/sendmailer");
const sendToken = require("../utils/jwtToken");
const {isAuthenticated} = require("../middleware/auth");
const {upload}=require("../multer");

router.get("/userinfo",isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const user=req.user
        res.status(200).json({user})
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
        const {password:newPassword,...rest}=user
        if (!isPasswordValid) {
            return next(new ErrorHandler("Please provide the correct information", 400))
        }
        sendToken(user, 200, res, "logged in successfull",rest);
    } catch (err) {
        return next(new ErrorHandler(err.message, 400))
    }
}))

router.post('/setimage',isAuthenticated,upload.single('userimage'),catchAsyncErrors(async (req, res, next) => {
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
          {new:true}
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

router.patch('/add-address',isAuthenticated,catchAsyncErrors(async(req,res,next)=>{
    try {
        const {_id}=req.user._id;
        console.log(req.user)
        if(req.user.addresses.length>=5){
            return next( new ErrorHandler("you can't hold more than 5 Address",400))
        }
        const {country,state,city,address,zipCode}=req.body
        if(!country||!city || !address || !zipCode){
            return next (new ErrorHandler("please fill all the required fields",400))
        }
        if(zipCode.length!==6){
            return next (new ErrorHandler("please provide valid zipcode",400))
        }
        const user = await User.findByIdAndUpdate(
            {_id},
            {$push:{addresses:{country,state,city,address,zipCode}}},
            {new:true})
        console.log(user)
        res.status(200).json({
            success:true,
            user:user
        })
    } catch (err) {
        return next (new ErrorHandler(err.message,400))
    }
}))

module.exports = router