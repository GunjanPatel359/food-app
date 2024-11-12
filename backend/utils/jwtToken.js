const sendToken =async(user,statusCode,res,msg,rest)=>{
    const token=await user.getJwtToken(user._id);
    const options={
        // domain: '.vercel.app',
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'None'   
    };
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        message:msg,
        token: token
    })
}

module.exports=sendToken