const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  employeeCode: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  emergencyContactNo: {
    type: String,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  gender: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  skills: {
    type: String,
  },
  address: {
    type: String,
  },
  pincode: {
    type: String,
  },
  technology: {
    type: [String],
    default: []
  },
  profilePhoto: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  passwordOriginal: {
    type: String,
  },
  aadharCardNo: {
    type: String,
  },
  panCardNo: {
    type: String,
  },
  bankAccountNumber: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
  approvalStatus: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dateOfJoining: {
    type: String,
  },
  dateofLeaving: {
    type: String,
  },
  createdAt: {
    type: String,
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
  deviceId: {
    type: String,
  },
  onesignalPlayerId: {
    type: String,
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
