const express = require('express');
const router = express.Router();
const admincontroller =require('../controllers/admincontroller');
const { isLoggined, isAdmin } = require('../ulti/login');
const cookieParser = require('cookie-parser');


router.use(cookieParser());

router.get('/product/create', admincontroller.create);
router.get('/product/update/:id', admincontroller.update);
// router.get('/product/delete', admincontroller.delete);
router.get('/', isLoggined,isAdmin,admincontroller.index);

module.exports = router;