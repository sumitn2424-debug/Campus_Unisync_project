const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    semester: { type: String },
    specialization: { type: String },
    isProfileComplete: { type: Boolean, default: false }

});

const UserModel = mongoose.model('UserData', userSchema);


module.exports = UserModel;