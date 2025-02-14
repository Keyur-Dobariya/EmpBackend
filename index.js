const express = require("express");
const expressApp = express();
// const UserModel = require("./lib/Models/User");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const AuthRouter = require("./lib/Routes/AuthRouter");
const RequestRouter = require("./lib/Routes/RequestRouter");
const UserDataRouter = require("./lib/Routes/UserDataRouter");
const NotesRouter = require("./lib/Routes/NotesRouter");
const path = require("path");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const { AttendanceModel, UserModel } = require("./lib/Models/User");

const http = require("http");
const { Server } = require("socket.io");

require("./cronJob");

const mongo_url = process.env.MONGO_CONN;

async function connectToDatabase() {
  try {
    await mongoose.connect(mongo_url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function startServer() {
  await connectToDatabase();

  const PORT = process.env.PORT || 8080;

  expressApp.get("/ping", (req, res) => {
    res.send("PONG");
  });

  expressApp.use(bodyParser.json());
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(cors());
  expressApp.use("/auth", AuthRouter);
  expressApp.use("/api", UserDataRouter);
  expressApp.use("/api", RequestRouter);
  expressApp.use("/api/notes", NotesRouter);
  expressApp.use(express.static(path.join(__dirname, "lib", "frontend")));

  socketConnection(PORT);

  // expressApp.listen(PORT, () => {
  //   console.log(`Server is running on ${PORT}`);
  //   startElectronApp();
  // });
}

const socketConnection = async (PORT) => {
  const server = http.createServer(expressApp);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5201",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const userChangeStream = UserModel.watch();
    userChangeStream.on("change", async (change) => {
      const changedData = JSON.stringify(change);
      const user = await UserModel.findById(changedData.documentKey._id);
      if (user) {
        socket.emit("employeeData", JSON.stringify(change));
      }
      console.log("User:", changedData);
    });

    const attendanceChangeStream = AttendanceModel.watch();
    attendanceChangeStream.on("change", async (change) => {
      const changedData = JSON.stringify(change);
      const attendance = await AttendanceModel.findById(changedData.documentKey._id);
      if (attendance) {
        socket.emit("attendanceData", JSON.stringify(change));
      }
      console.log("Attendance:", changedData);
    });

    socket.on("socketMessage", (data) => {
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
      socket.emit("receive_message", data);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    startElectronApp();
  });
};

const pathToElectron = path.join(
  __dirname,
  "node_modules",
  "electron",
  "dist",
  "electron"
);

function startElectronApp() {
  const electronProcess = spawn(pathToElectron, ["electron.js"], {
    stdio: "inherit",
  });

  electronProcess.on("error", (error) => {
    console.error("Error spawning Electron process:", error);
  });

  electronProcess.on("exit", (code) => {
    console.log(`Electron process exited with code ${code}`);
  });
}

startServer();
