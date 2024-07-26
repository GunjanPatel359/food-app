const express= require('express')
const { SubscriptionPlans } = require('../utils/SubscriptionPlans')
const router= express.Router()

router.get('/all/subscription-plans',async(req,res,next)=>{
    const plans=SubscriptionPlans
    return res.status(200).json(plans)
})


module.exports=router