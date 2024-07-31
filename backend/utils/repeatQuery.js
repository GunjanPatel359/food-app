const Subscription = require("../model/subscription");
const Seller = require("../model/seller");
const { compareIsoDateWithUnixTime } = require("./basicFunctions");
const { SubscriptionPlans } = require("./SubscriptionPlans");

async function checkForSellerSubscription(sellerinfo) {
    try {
        let seller = sellerinfo
        let newseller
        if (!seller.subscriptionIds) {
            return null
        }

        if (seller.subscriptionIds.length < 1) {
            return null
        }

        let subscription = await Subscription.findOne({
            _id: seller.subscriptionIds[0],
            sellerId: seller._id,
        })

        if (compareIsoDateWithUnixTime(subscription.endingDate, Date.now())) {
            subscription.active = false;
            await subscription.save();

            newseller = await Seller.findOneAndUpdate({
                _id: seller._id
            }, {
                $pull: { subscriptionIds: subscription._id }
            }, { new: true })

            if (seller.subscriptionIds.length > 0) {

                subscription = await Subscription.findOne({
                    _id: seller.subscriptionIds[0]
                })

                const subscriptionpack = SubscriptionPlans.find((item) => item.id == subscription.subscriptionId)
                let enddate

                if (subscriptionpack.duration == "month") {
                    enddate = Date.now() + 86400000 * 30
                } else if (subscriptionpack.duration == "year") {
                    enddate = Date.now() + 86400000 * 365
                } else {
                    enddate = Date.now() + 86400000 * 1
                }

                subscription = await Subscription.findOneAndUpdate({
                    _id: subscription._id,
                }, {
                    startingDate: Date.now(),
                    endingDate: enddate,
                    active: true,
                }, { new: true })

                return subscription

            } else {
                return null
            }

        } else {
            return subscription
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    checkForSellerSubscription
}