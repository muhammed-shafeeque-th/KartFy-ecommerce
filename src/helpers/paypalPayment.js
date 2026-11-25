const paypal = require('paypal-rest-sdk');
const asyncHandler = require('../utilities/asyncHandler');
const ApiError = require('../utilities/apiError');
const { config } = require('../config/app.config');


paypal.configure({
    mode: config.paypal.mode,
    client_id: config.paypal.clientId,
    client_secret: config.paypal.secretKey,
});

const createPayPalPayment = async (req, res, next, myOrder) => {
    try {
        let items = myOrder.orderedItems.map((item, index) => {
            return {
                "name": 'ABC',
                "sku": String(index + 1),
                "price": item.totalPrice.toString(),
                "currency": "USD",
                "quantity": item.quantity.toString(),
            }
        })
        let totalAmount = myOrder.orderedItems.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${config.siteUrl}/orders/paypal-success`,
                "cancel_url": `${config.siteUrl}/orders/paypal-failure`,
            },
            "transactions": [{
                "item_list": {
                    "items": items

                },
                "amount": {
                    "currency": "USD",
                    "total": "" + totalAmount + ".00",
                },
                "description": "Hat for the best team ever"
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {

            if (error) {
                throw new ApiError(error.httpStatusCode, error.message, error.response, error.stack);
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });

    } catch (error) {
        console.log(error)

    }
}

const payPalSuccess = asyncHandler(async (req, res, next) => {
    const payerId = req.query.PayerId;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };
    const payment = await paypal.payment.execute(paymentId, execute_payment_json);
})

const payPalCancel = asyncHandler(async (req, res, next) => {
    res.send('Cancel')
})

module.exports = {
    payPalCancel,
    createPayPalPayment,
    payPalSuccess,

}





