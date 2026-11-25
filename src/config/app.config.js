require('dotenv').config();


module.exports.config = {

    sessionSecret: process.env.SESSION_SECRET || 'your-secret-key',
    port: process.env.PORT,
    siteUrl: process.env.SITE_URL,
    databaseUrl: process.env.DB_URL,
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        secretKey: process.env.RAZORPAY_SECRET_KEY
    },
    paypal: {
        mode: process.env.PAYPAL_MODE,
        clientId: process.env.PAYPAL_CLIENT_ID,
        secretKey: process.env.PAYPAL_SECRET_KEY,
    },
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
        accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
        refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
        bcryptSalt: process.env.BCRYPT_SALT,

    },
    mail: {

        password: process.env.GMAIL_PASSWORD,
        email: process.env.GMAIL_MAIL,
    }

}