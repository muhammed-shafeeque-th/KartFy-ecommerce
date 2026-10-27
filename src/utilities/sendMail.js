const nodemailer = require('nodemailer');
const OTP = require('../models/otp.model');
const { config } = require('../config/app.config');

const sendMail = async (email, subject, html) => {

    const Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: config.mail.email,
            pass: config.mail.password,
        }
    });


    const mailOptions = {
        from: 'CartFy',
        to: email,
        subject,
        html,

    }
    try {

        const mailSent = await Transport.sendMail(mailOptions);

    } catch (error) {
        console.log(error);

        throw Error("Something went wrong while dispatching mail");

    }


}

module.exports = sendMail;