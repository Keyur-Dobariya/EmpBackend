const express = require('express');
const app = express();
const UserModel = require("./lib/Models/User");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
// require('./lib/Database/db');
const AuthRouter = require('./lib/Routes/AuthRouter');
const RequestRouter = require('./lib/Routes/RequestRouter');
const UserDataRouter = require('./lib/Routes/UserDataRouter');
const NotesRouter = require('./lib/Routes/NotesRouter');
const path = require('path');


const mongoose = require('mongoose');


const mongo_url = process.env.MONGO_CONN;
  
// const WebSocket = require('ws');
// const { log } = require('console');
// const wss = new WebSocket.Server({ port: 8080 });



// const fs = require('fs');
// const https = require('https');

// const privateKeyPath = path.join(__dirname, 'privatekey.pem');
// const certificatePath = path.join(__dirname, 'certificate.crt');

// const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
// const certificate = fs.readFileSync(certificatePath, 'utf8');

// const server = https.createServer({
//   key: privateKey,
//   cert: certificate,
// });

// const server = https.createServer({
//     key: privateKey, // Your private key
//     cert: certificate, // Your signed certificate
// });

// const wss = new WebSocket.Server({ server });
// server.listen(8080)





// const wss = new WebSocket.Server({ port: 8080 });



async function connectToDatabase() {
    try {
        await mongoose.connect(mongo_url);
        console.log('Connected to MongoDB');
        // watchCollection();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
    
connectToDatabase();
    
// async function watchCollection() {
//     try {
//         const collection = mongoose.connection.db.collection('users');
//         const changeStream = collection.watch();
//         changeStream.on('change', async (change) => {
//             console.log("detectchange");
//             log("detectchange");
//             const users = await UserModel.find();
//             log("users", users);
//             console.log("users", users);
//             broadcast(JSON.stringify({ success: true, message: "Data fetched successfully", data: users }));
//         });

//         console.log('Watching collection for changes...');
//     } catch (error) {
//         console.error('Error watching collection:', error);
//     }
// }

// function broadcast(data) {
//     console.log("data",data)
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(data);
//       }
//     });
// }
  
// wss.on('connection', (ws) => {
//     console.log('Client connected');
//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });
  
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
})

app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/api', UserDataRouter);
app.use('/api', RequestRouter);
app.use('/api/notes', NotesRouter);
app.use(express.static(path.join(__dirname, 'lib', 'frontend')));

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})