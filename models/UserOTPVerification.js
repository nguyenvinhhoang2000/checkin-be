const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserOTPVerificationShchema = new Schema({
    email: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
})

module.exports = mongoose.model(
    "user_otp_verification",
    UserOTPVerificationShchema
);