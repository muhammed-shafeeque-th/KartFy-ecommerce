const paypal = require('paypal-rest-sdk');
const asyncHandler = require('../utilities/asyncHandler');

const Razorpay = require('razorpay');
const ApiError = require('../utilities/apiError');
const { config } = require('../config/app.config');

const keyId = config.razorpay.keyId;
const secretKey = config.razorpay.secretKey;

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: secretKey,
})

module.exports.createRazorpayPayment = (res, myOrder) => {
    const amount = myOrder.orderAmount * 100;
    const options = {
        amount,
        currency: 'INR',
        // reciept: ''+order.orderId
    }
    console.log(myOrder)
    console.log(options)
    razorpayInstance.orders.create(options,
        (error, order) => {
            if (error) {
                throw new ApiError(error.statusCode, error.error.reason, error);

            }
            return res.status(200)
                .json({
                    orderId: myOrder._id,
                    order,
                    success: true,
                    paymentType: 'RazorPay',
                    message: 'Order Created',
                    order_id: order._id,
                    amount: amount,
                    key_id: keyId,
                    contact: '9745191844',
                    name: 'CartFy Online',
                    email: 'cartfyOnline@gmail.com'
                })
        })
}
