const { UserModel, AttendanceModel } = require("../Models/User");
const NotesModel = require("../Models/Notes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const {
  handleError,
  setDefaultUserData,
  findEmailAddress,
  findMobileNumber,
  hashPassword,
} = require("../utils/utils");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./localStorageData");
const screenshot = require("screenshot-desktop");
const path = require("path");
const fs = require("fs");

const addUsers = async (req, res) => {
  try {
    const { emailAddress, mobileNumber } = req.body;

    const userData = setDefaultUserData(req.body);

    const emailExist = await findEmailAddress(emailAddress);
    if (emailExist) {
      return handleError(res, "Email Address Already Registerd", 400);
    }
    const mobileExist = await findMobileNumber(mobileNumber);
    if (mobileExist) {
      return handleError(res, "Mobile Number Already Registerd", 400);
    }

    const verificationToken = jwt.sign(
      { emailAddress },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    userData.userPermission = JSON.parse(userPermission);

    await UserModel.create({
      ...userData,
      profilePhoto: req.file ? req.file.path : "",
      password: await hashPassword(userData.password),
      verificationToken,
    });

    // await sendVerificationEmail(emailAddress, verificationToken);

    return res
      .status(201)
      .json({ success: true, message: "User Added Successfully" });
  } catch (err) {
    console.log(err);
    return handleError(res, "Internal Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: users,
    });
  } catch (err) {
    return handleError(res, "Internal Server Error");
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return handleError(res, "User not found", 400);
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    return handleError(res, "Internal Server Error");
  }
};

const getUserByEmail = async (req, res) => {
  const { emailAddress } = req.params;

  try {
    const user = await UserModel.findOne({ emailAddress });

    if (!user) {
      return handleError(res, "User not found", 400);
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    return handleError(res, "Internal Server Error");
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return handleError(res, "User not found", 400);
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    return handleError(res, "Internal Server Error");
  }
};

const getUserByName = async (req, res) => {
  const { name } = req.params;

  try {
    const users = await UserModel.find({ fullName: name });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found", data: [] });
    }

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err) {
    return handleError(res, "Internal Server Error");
  }
};

const OFFICE_START_TIME = moment()
  .set({ hour: 9, minute: 30, second: 0, millisecond: 0 })
  .valueOf();
const OFFICE_HOURS_MILLISECONDS = 9 * 60;

const addAttendance = async (req, res) => {
  const { userId, punchInTime, punchOutTime, breakInTime, breakOutTime } = req.body;
  
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const todayDate = moment().format("DD-MM-YYYY");
    let attendance = await AttendanceModel.findOne({ userId, date: todayDate });

    if (!attendance) {
      attendance = new AttendanceModel({
        userId,
        date: todayDate
      });
    }

    const convertToTimeFormat = (milliseconds) => {
      const hours = Math.floor(milliseconds / (1000 * 60 * 60));
      const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    if (punchInTime) {
      const lastPunch = attendance.punchTime.length > 0 ? attendance.punchTime[attendance.punchTime.length - 1] : null;

      if (lastPunch && !lastPunch.punchOutTime) {
        return res.status(400).json({ success: false, message: "You must punch out before punching in again." });
      }

      const punchInTimestamp = Number(punchInTime);
      attendance.punchTime.push({ punchInTime: punchInTimestamp, punchOutTime: "" });

      if (!attendance.punchInAt) {
        attendance.punchInAt = punchInTimestamp;
      }

      if (attendance.punchTime.length === 1) {
        const officeStartTime = moment(OFFICE_START_TIME, "hh:mm A").valueOf();
        if (punchInTimestamp > officeStartTime) {
          const diff = punchInTimestamp - officeStartTime;
          attendance.lateArrival = convertToTimeFormat(diff);
        } else {
          attendance.lateArrival = "0h 0m 0s";
        }
      }

      attendance.isPunchIn = true;
    }

    if (punchOutTime) {
      if (attendance.punchTime.length === 0) {
        return res.status(400).json({ success: false, message: "You must punch in first." });
      }

      if (attendance.isBreakIn) {
        return res.status(400).json({ success: false, message: "You must break out first." });
      }

      const lastPunch = attendance.punchTime[attendance.punchTime.length - 1];
      if (lastPunch.punchOutTime) {
        return res.status(400).json({ success: false, message: "You have already punched out. Punch in first." });
      }

      lastPunch.punchOutTime = Number(punchOutTime);
      attendance.isPunchIn = false;
    }

    if (breakInTime) {
      if (!attendance.isPunchIn) {
        return res.status(400).json({ success: false, message: "You must be punched in to take a break." });
      }

      const lastBreak = attendance.breakTime.length > 0 ? attendance.breakTime[attendance.breakTime.length - 1] : null;

      if (lastBreak && !lastBreak.breakOutTime) {
        return res.status(400).json({ success: false, message: "You must break out before another break in." });
      }

      attendance.breakTime.push({ breakInTime: Number(breakInTime), breakOutTime: "" });
      attendance.isBreakIn = true;
    }

    if (breakOutTime) {
      if (attendance.breakTime.length === 0) {
        return res.status(400).json({ success: false, message: "You must break in first." });
      }

      const lastBreak = attendance.breakTime[attendance.breakTime.length - 1];
      if (lastBreak.breakOutTime) {
        return res.status(400).json({ success: false, message: "You have already broken out. Break in first." });
      }

      lastBreak.breakOutTime = Number(breakOutTime);
      attendance.isBreakIn = false;
    }

    let totalMilliseconds = 0;
    if (attendance.punchTime.length > 0) {
      const firstPunch = attendance.punchTime[0].punchInTime;
      const lastPunch = attendance.punchTime[attendance.punchTime.length - 1].punchOutTime || moment().valueOf();
      totalMilliseconds = lastPunch - firstPunch;
    }

    let totalBreakMilliseconds = 0;
    attendance.breakTime.forEach(brk => {
      if (brk.breakInTime && brk.breakOutTime) {
        totalBreakMilliseconds += brk.breakOutTime - brk.breakInTime;
      }
    });

    const workingMilliseconds = totalMilliseconds - totalBreakMilliseconds;

    attendance.workingHours = convertToTimeFormat(workingMilliseconds);
    attendance.breakHours = convertToTimeFormat(totalBreakMilliseconds);
    attendance.totalHours = convertToTimeFormat(totalMilliseconds);

    const overtimeMilliseconds = workingMilliseconds - OFFICE_HOURS_MILLISECONDS;
    if (overtimeMilliseconds > 0) {
      attendance.overtime = convertToTimeFormat(overtimeMilliseconds);
    } else {
      attendance.overtime = "0h 0m 0s";
    }

    await attendance.save();

    const updatedAttendance = await AttendanceModel.findOne({ userId, date: todayDate });
    
    localStorage.setItem('isPunchIn', updatedAttendance.isPunchIn);

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: updatedAttendance,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getTodayAttendance = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const todayDate = moment().format("DD-MM-YYYY");
    let attendance = await AttendanceModel.findOne({ userId, date: todayDate });

    return res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: attendance,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addUsers,
  getAllUsers,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUserByName,
  addAttendance,
  getTodayAttendance,
};
