// const { upload } = require('../Controllers/RequestController');
const { getAllUsers, deleteUser, getUserByEmail, getUserByName, addUsers, getUserById } = require('../Controllers/UserDataController');
const { upload } = require('../Database/cloudinaryConfig');
const ensureAuthenticated = require('../Middlewares/Auth');
const { addUserValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();
router.post('/addUser', ensureAuthenticated, upload.single('profilePhoto'), addUsers);
// router.post('/addUser', ensureAuthenticated, upload.single('profilePhoto'), addUserValidation, addUsers);
router.get('/getAllUsers', ensureAuthenticated, getAllUsers);
router.delete('/deleteUser/:id', ensureAuthenticated, deleteUser);
router.get('/getUserByEmail/:email', ensureAuthenticated, getUserByEmail);
router.get('/getUserById/:userId', ensureAuthenticated, getUserById);
router.get('/getUserByName/:name', ensureAuthenticated, getUserByName);

module.exports = router;