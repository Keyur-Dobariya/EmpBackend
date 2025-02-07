const { UserModel, AttendanceModel } = require("../Models/User");
const NotesModel = require("../Models/Notes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  handleError,
  setDefaultUserData,
  findEmailAddress,
  findMobileNumber,
  hashPassword,
} = require("../utils/utils");

const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./localStorageData');
const screenshot = require('screenshot-desktop');
const path = require('path');
const fs = require('fs');

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
      profilePhoto: req.file ? req.file.path : '',
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
    return res
      .status(200)
      .json({
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

    return res
      .status(200)
      .json({
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

    return res
      .status(200)
      .json({
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

    return res
      .status(200)
      .json({
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

    return res
      .status(200)
      .json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
  } catch (err) {
    return handleError(res, "Internal Server Error");
  }
};

const addAttendance = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingAttendance = await AttendanceModel.findById(userId);

    if (existingAttendance) {
      await AttendanceModel.findByIdAndUpdate(userId, {
        ...req.body,
      });

      localStorage.setItem('isPunchIn', req.body.isPunchIn);

      screenshot().then((img) => {
        console.log("image-->", img);
        const uploadFolder = path.join(__dirname, 'uploads');

        if (!fs.existsSync(uploadFolder)) {
          fs.mkdirSync(uploadFolder);
        }
        
        // Create a unique filename (timestamp + extension)
        const filename = `${Date.now()}.jpg`; // Assuming it's a JPG image based on the binary header
        
        // Define the full path where the image will be saved
        const filePath = path.join(uploadFolder, filename);
        
        // Write the buffer to the file
        fs.writeFile(filePath, img, (err) => {
          if (err) {
            console.error('Error saving the image:', err);
          } else {
            console.log('Image saved successfully at', filePath);
          }
        });
      }).catch((err) => {
        console.log("err-->", err);
      })

      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
      });
    } else {
      await AttendanceModel.create({
        _id: user._id,
        ...req.body,
      });

      return res.status(201).json({
        success: true,
        message: "Attendance added successfully",
      });
    }
  } catch (err) {
    console.log(err);
    return handleError(res, "Internal Server Error");
  }
};

const getAttendanceById = async (req, res) => {

  // const formData = new FormData();

// formData.append("file", dataUrlMain);
// formData.append("api_key", "996662845841723");
// formData.append("upload_preset", "empManageSS");

// const response = await fetch(
//   "https://api.cloudinary.com/v1_1/dzkykyugo/image/upload",
//   {
//     method: "POST",
//     body: formData,
//   }
// );
// const responseData = await response.json();
// console.log("response--->", responseData);

  const { userId } = req.params;
  try {
    const attendance = await AttendanceModel.findById(userId);

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Attendance Fetched",
        data: attendance,
      });
   
  } catch (err) {
    console.log(err);
    return handleError(res, "Internal Server Error");
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
  getAttendanceById,
};
