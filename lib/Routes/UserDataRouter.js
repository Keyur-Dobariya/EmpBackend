const { upload } = require('../Controllers/RequestController');
const { getAllUsers, deleteUser, getUserByEmail, getUserByName, addUsers, getUserById } = require('../Controllers/UserDataController');
const ensureAuthenticated = require('../Middlewares/Auth');
const { signupValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/addUser', ensureAuthenticated, upload.single('profilePhoto'), signupValidation, addUsers);
router.get('/getAllUsers', ensureAuthenticated, getAllUsers);
router.delete('/deleteUser/:id', ensureAuthenticated, deleteUser);
router.get('/getUserByEmail/:email', ensureAuthenticated, getUserByEmail);
router.get('/getUserById/:userId', ensureAuthenticated, getUserById);
router.get('/getUserByName/:name', ensureAuthenticated, getUserByName);

module.exports = router;