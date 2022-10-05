const express = require('express');
const router = express.Router();
const User = require('../models/User');

const {isLoggined, isAdmin, isStaff} = require('../ulti/login');
const userController = require('../controllers/usercontroller');

module.exports = router;

