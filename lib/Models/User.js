const mongoose = require("mongoose");
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
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  profilePhoto: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  emergencyContactNo: {
    type: String,
  },
  hobbies: {
    type: String,
  },
  panCardNo: {
    type: String,
  },
  aadharCardNo: {
    type: String,
  },
  address: {
    type: String,
  },
  employeeCode: {
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
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
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
  deviceId: {
    type: String,
  },
  onesignalPlayerId: {
    type: String,
  },
  dateOfJoining: {
    type: Date,
  },
  dateOfTerminate: {
    type: Date,
  },
  deleted: {
    type: Boolean,
  },
  permission: {
    type: Map,
  },
});

const UserModel = mongoose.model("employee", UserSchema);
module.exports = UserModel;
