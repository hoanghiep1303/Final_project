const express = require('express');
const router = express.Router();
const User = require('../models/User');

const {isLoggined, isAdmin, isStaff} = require('../ulti/login');
const userController = require('../controllers/usercontroller');


router.post('/update/:id', isLoggined,userController.update);
router.post('/change-avatar/:id', isLoggined,userController.changeAvatar);
router.post('/change-password', isLoggined,userController.changePassword);

module.exports = router;

