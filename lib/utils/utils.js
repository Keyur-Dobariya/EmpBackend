const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const UserModel = require("../Models/User");
const PerMapKeys = require('./PerMapKeys');

const handleError = (res, message, status = 500) => {
    return res.status(status).json({ success: false, message: message });
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const findEmailAddress = async (emailAddress) => {
    return await UserModel.findOne({ emailAddress });
};

const findMobileNumber = async (mobileNumber) => {
    return await UserModel.findOne({ mobileNumber });
};

const generateJwtToken = (user) => {
    return jwt.sign(
        { emailAddress: user.emailAddress, _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE_TIME }
    );
};

const setDefaultUserData = (data) => {
    const userPermissionData = {
        [PerMapKeys.user]: {
          [PerMapKeys.read]: false,
          [PerMapKeys.add]: false,
          [PerMapKeys.update]: false,
          [PerMapKeys.delete]: false,
          [PerMapKeys.canAssignPermission]: false,
        },
        [PerMapKeys.complaint]: {
          [PerMapKeys.read]: {
            [PerMapKeys.active]: {
              [PerMapKeys.all]: false,
              [PerMapKeys.mentioned]: true,
              [PerMapKeys.hide]: false,
            },
            [PerMapKeys.pending]: {
              [PerMapKeys.all]: false,
              [PerMapKeys.mentioned]: true,
              [PerMapKeys.hide]: false,
            },
            [PerMapKeys.rejected]: {
              [PerMapKeys.all]: false,
              [PerMapKeys.mentioned]: true,
              [PerMapKeys.hide]: false,
            },
            [PerMapKeys.closed]: {
              [PerMapKeys.all]: false,
              [PerMapKeys.mentioned]: true,
              [PerMapKeys.hide]: false,
            },
            [PerMapKeys.onRoot]: {
              [PerMapKeys.all]: false,
              [PerMapKeys.mentioned]: true,
              [PerMapKeys.hide]: false,
            },
          },
          [PerMapKeys.add]: true,
          [PerMapKeys.update]: true,
          [PerMapKeys.delete]: false,
          [PerMapKeys.complaintAssign]: false,
          [PerMapKeys.complaintClose]: false,
        }
      };
    return {
        fullName: data.fullName || '',
        emailAddress: data.emailAddress || '',
        mobileNumber: data.mobileNumber || '',
        password: data.password || '',
        passwordOriginal: data.password || '',
        gender: data.gender || '',
        dateOfBirth: data.dateOfBirth || '',
        profilePhoto: data.profilePhoto || '',
        bloodGroup: data.bloodGroup || '',
        emergencyContactNo: data.emergencyContactNo || '',
        hobbies: data.hobbies || '',
        panCardNo: data.panCardNo || '',
        aadharCardNo: data.aadharCardNo || '',
        address: data.address || '',
        employeeCode: data.employeeCode || '',
        userRole: data.userRole || 'User',
        approvalStatus: data.approvalStatus || 'Pending',
        createdAt: moment().format('DD-MM-YYYY HH:mm A'),
        lastLogin: data.lastLogin || '',
        isActive: data.isActive || false,
        isEmailVerified: data.isEmailVerified || false,
        isMobileVerified: data.isMobileVerified || false,
        mPin: data.mPin || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        deviceId: data.deviceId || '',
        onesignalPlayerId: data.onesignalPlayerId || '',
        dateOfJoining: data.dateOfJoining || '',
        dateOfTerminate: data.dateOfTerminate || '',
        deleted: data.deleted || false,
        userPermission: data.userPermission || userPermissionData
    };
};

const setDefaultRequestData = (data) => {
    return {
        name: data.name || '',
        mobile: data.mobile || '',
        mobile2: data.mobile2 || '',
        address: data.address || '',
        district: data.district || '',
        subDistrict: data.subDistrict || '',
        village: data.village || '',
        pinCode: data.pinCode || '',
        productImages: data.productImages || [],
        warrantyCardImages: data.warrantyCardImages || [],
        priority: data.priority || '',
        activeStatus: data.activeStatus || '',
        approvalStatus: data.approvalStatus || '',
        reason: data.reason || '',
        complaintCreatedDate: moment().format('DD-MM-YYYY HH:mm A'),
        complaintCloseDate: data.complaintCloseDate || '',
        status: data.status || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        assignedPersonName: data.assignedPersonName || '',
        assignedPersonUserId: data.assignedPersonUserId || '',
        complaintAddPersonName: data.complaintAddPersonName || '',
        complaintAddPersonUserId: data.complaintAddPersonUserId || '',
        approvedPersonName: data.approvedPersonName || '',
        approvedPersonUserId: data.approvedPersonUserId || '',
        isOtpSend: data.isOtpSend || false,
        otp: data.otp || '',
        complaintId: data.complaintId || '',
        productName: data.productName || '',
        productDescription: data.productDescription || '',
        dueDate: data.dueDate || '',
        usedSpareParts: data.usedSpareParts || '',
        receivedAmount: data.receivedAmount || '',
      };
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    handleError,
    hashPassword,
    findEmailAddress,
    findMobileNumber,
    generateJwtToken,
    setDefaultUserData,
    setDefaultRequestData,
    generateOtp,
};
