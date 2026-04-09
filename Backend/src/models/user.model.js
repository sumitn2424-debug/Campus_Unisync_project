const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    otpAttempts: {
        type: Number,
        default: 0
    },
    otpBlockedUntil: {
        type: Date
    },
    otpResendCooldown: {
        type: Date
    }

});

const UserModel = mongoose.model('UserData', userSchema);


module.exports = UserModel;