const mongoose = require("mongoose");
const moment = require('moment');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  employeeCode: {
    type: String,
    default: "",
    description: "Employee Code 123",
  },
  fullName: {
    type: String,
    required: true,
    default: "",
  },
  dateOfBirth: {
    type: String,
    default: "",
  },
  mobileNumber: {
    type: String,
    required: true,
    default: "",
  },
  emergencyContactNo: {
    type: String,
    default: "",
  },
  emailAddress: {
    type: String,
    required: true,
    default: "",
  },
  role: {
    type: String,
    default: "Employee",
  },
  gender: {
    type: String,
    default: "",
  },
  bloodGroup: {
    type: String,
    default: "",
  },
  skills: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  pincode: {
    type: String,
    default: "",
  },
  technology: {
    type: [String],
    default: [],
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
    default: "",
  },
  passwordOriginal: {
    type: String,
    default: "",
  },
  aadharCardNo: {
    type: String,
    default: "",
  },
  panCardNo: {
    type: String,
    default: "",
  },
  bankAccountNumber: {
    type: String,
    default: "",
  },
  ifscCode: {
    type: String,
    default: "",
  },
  approvalStatus: {
    type: String,
    default: "Pending",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dateOfJoining: {
    type: String,
    default: "",
  },
  dateofLeaving: {
    type: String,
    default: "",
  },
  createdAt: {
    type: String,
    default: moment().format("DD-MM-YYYY HH:mm A"),
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
    default: "",
  },
  otp: {
    type: String,
    default: "",
  },
  deviceId: {
    type: String,
    default: "",
  },
  onesignalPlayerId: {
    type: String,
    default: "",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  permission: {
    type: Map,
    default: {},
  },
});

const UserModel = mongoose.model("employee", UserSchema);
module.exports = UserModel;
