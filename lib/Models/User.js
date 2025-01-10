const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordOriginal: {
        type: String,
    },
    userRole: {
        type: String,
    },
    approvalStatus: {
        type: String,
    },
    createdAt: {
        type: String,
    },
    lastLogin: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    },
    otp: {
        type: String,
    },
    mPin: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
    deviceId: {
        type: String,
    },
    onesignalPlayerId: {
        type: String,
    },
    userPermission: {
        type: Map,
    },
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;