const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true,unique: true },
    email: { type: String, required: true,unique: true },
    password: { type: String, required: true,unique: true },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },

});

const UserModel = mongoose.model('UserData', userSchema);


module.exports = UserModel;