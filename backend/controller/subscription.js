const express= require('express')
const router= express.Router()
const { SubscriptionPlans } = require('../utils/SubscriptionPlans')

router.get('/all/subscription-plans',async(req,res,next)=>{
    const plans=SubscriptionPlans
    return res.status(200).json(plans)
})


module.exports=router