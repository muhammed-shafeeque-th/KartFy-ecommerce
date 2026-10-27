const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { config } = require('../config/app.config');

const { accessTokenExpiry, accessTokenSecret, bcryptSalt, refreshTokenExpiry, refreshTokenSecret, } = config.jwt;




const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }, name: {
        type: String,
        required: true,
    }, password: {
        type: String,
    }, isBlocked: {
        type: Boolean,
        default: false,

    }, passwordResetTocken: {
        type: String,
        default: ''

    }

},
    {
        timestamps: true
    });
// userSchema.pre('save', async (next) => {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, BCRYPT_SALT);
//         next();
//     }
//     next();
// });

userSchema.methods.isPasswordMatch = async (password) => {
    return await bcrypt.compare(password, this.password);


}

userSchema.methods.generateAccessToken = () => {

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name
    },
        accessTokenSecret,
        {
            expiresIn: accessTokenExpiry
        }
    )




}
userSchema.methods.generateRefreshToken = () => {
    return jwt.sign({
        _id: this._id,
    },
        refreshTokenSecret,
        {
            expiresIn: refreshTokenExpiry
        }
    )

}

const User = mongoose.model('User', userSchema);

module.exports = User;