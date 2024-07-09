const sendToken =(user,statusCode,res,msg)=>{
    const token=user.getJwtToken();

    const options={
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly:true    
    };
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        message:msg,
        token
    })
}

module.exports=sendToken