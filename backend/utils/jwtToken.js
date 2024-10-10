const sendToken =async(user,statusCode,res,msg,rest)=>{
    const token=await user.getJwtToken(user._id);
    const options={
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        sameSite: 'none'   
    };
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        message:msg,
        user:rest
    })
}

module.exports=sendToken