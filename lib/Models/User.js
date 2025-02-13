const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

// User Schema
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

const AttendanceSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  punchTime: [
    {
      punchInTime: { type: String, default: "" },
      punchOutTime: { type: String, default: "" },
    }
  ],
  breakTime: [
    {
      breakInTime: { type: String, default: "" },
      breakOutTime: { type: String, default: "" },
    }
  ],
  isPunchIn: { type: Boolean, default: false },
  isBreakIn: { type: Boolean, default: false },
  workingHours: { type: String, default: "0h 0m 0s" },
  breakHours: { type: String, default: "0h 0m 0s" },
  overtime: { type: String, default: "0h 0m 0s" },
  totalHours: { type: String, default: "0h 0m 0s" },
  lateArrival: { type: String, default: "0h 0m 0s" },
  punchInAt : { type: String, default: null },
  status: { type: String, enum: ["Present", "Absent", "Leave"], default: "Present" },
  date: { type: String, default: moment().format("DD-MM-YYYY") },
  createdAt: { type: String, default: moment().format("DD-MM-YYYY HH:mm A") },
});

UserSchema.virtual("attendance", {
  ref: "attendance",
  localField: "_id",
  foreignField: "userId",
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

const UserModel = mongoose.model("employee", UserSchema);
const AttendanceModel = mongoose.model("attendance", AttendanceSchema);

module.exports = { UserModel, AttendanceModel };
