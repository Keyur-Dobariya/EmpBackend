const express = require('express');
const expressApp = express();
// const UserModel = require("./lib/Models/User");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const AuthRouter = require('./lib/Routes/AuthRouter');
const RequestRouter = require('./lib/Routes/RequestRouter');
const UserDataRouter = require('./lib/Routes/UserDataRouter');
const NotesRouter = require('./lib/Routes/NotesRouter');
const path = require('path');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const { AttendanceModel, UserModel } = require("./lib/Models/User");

const http = require("http");
const { Server } = require("socket.io");

const mongo_url = process.env.MONGO_CONN;



async function connectToDatabase() {
    try {
        await mongoose.connect(mongo_url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function startServer() {
    await connectToDatabase();
    
    const PORT = process.env.PORT || 8080;

    expressApp.get('/ping', (req, res) => {
        res.send('PONG');
    });

    expressApp.use(bodyParser.json());
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.use(cors());
    expressApp.use('/auth', AuthRouter);
    expressApp.use('/api', UserDataRouter);
    expressApp.use('/api', RequestRouter);
    expressApp.use('/api/notes', NotesRouter);
    expressApp.use(express.static(path.join(__dirname, 'lib', 'frontend')));

    const server = http.createServer(expressApp);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  
  io.on("connection", (socket) => {
    // console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
      socket.join(data);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  });
  
  server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
  });

    // const privateKey = fs.readFileSync(path.join(__dirname, 'privatekey.pem'), 'utf8');
    // const certificate = fs.readFileSync(path.join(__dirname, 'certificate.crt'), 'utf8');
    
    // // Assuming the private key is encrypted, you can specify the passphrase when creating the secure context
    // const passphrase = 'your-passphrase';  // Replace with your passphrase
    
    // const server = https.createServer({
    //   key: privateKey,
    //   cert: certificate,
    //   passphrase: passphrase
    // }, expressApp);

    // // Create WebSocket server on top of the HTTPS server
    // const wss = new WebSocket.Server({ server });

    // // WebSocket logic
    // wss.on("connection", (ws) => {
    //     console.log("Frontend connected");

    //     // Send a message to frontend upon successful connection
    //     ws.send("Connected to WebSocket server");

    //     // Listen for changes in the User collection
    //     const userChangeStream = UserModel.watch();
    //     userChangeStream.on("change", (change) => {
    //         console.log("Change detected in User collection:", change);
    //         // Send the detected change to the frontend
    //         ws.send(`User collection changed: ${JSON.stringify(change)}`);
    //     });

    //     // Listen for changes in the Attendance collection
    //     const attendanceChangeStream = AttendanceModel.watch();
    //     attendanceChangeStream.on("change", (change) => {
    //         console.log("Change detected in Attendance collection:", change);
    //         // Send the detected change to the frontend
    //         ws.send(`Attendance collection changed: ${JSON.stringify(change)}`);
    //     });

    //     // Handle WebSocket message from frontend (optional)
    //     ws.on("message", (message) => {
    //         console.log("Received message from frontend:", message);
    //     });

    //     // Handle WebSocket connection close
    //     ws.on("close", () => {
    //         console.log("Frontend disconnected");
    //         userChangeStream.close();  // Stop watching when the frontend disconnects
    //         attendanceChangeStream.close();  // Stop watching when the frontend disconnects
    //     });
    // });

    // // Start the HTTPS server
    // server.listen(PORT, () => {
    //     console.log(`HTTPS server running on https://localhost:${PORT}`);
    // });

    // expressApp.listen(PORT, () => {
    //     console.log(`Server is running on ${PORT}`);
    //     startElectronApp();
    // });
}

const pathToElectron = path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron');

function startElectronApp() {
    const electronProcess = spawn(pathToElectron, ['electron.js'], {
        stdio: 'inherit'
    });

    electronProcess.on('error', (error) => {
        console.error('Error spawning Electron process:', error);
    });

    electronProcess.on('exit', (code) => {
        console.log(`Electron process exited with code ${code}`);
    });
}

startServer();
