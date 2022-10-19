const express = require('express');
const router = express.Router();
const admincontroller =require('../controllers/admincontroller');
const cookieParser = require('cookie-parser');
const { isLoggined, isAdmin } = require('../ulti/login');

router.use(cookieParser());

router.use('/product-mgmt', isLoggined, isAdmin, admincontroller.productTable);

router.use('/category-mgmt', isLoggined, isAdmin, admincontroller.categoryTable);

router.use('/user-mgmt', isLoggined, isAdmin, admincontroller.userTable);

router.use('/product-deleted-table', isLoggined, isAdmin, admincontroller.deletedProductTable);

router.use('/category-deleted-table', isLoggined, isAdmin, admincontroller.deletedCategoryTable);

router.use('/user-deleted-table', isLoggined, isAdmin, admincontroller.deletedUserTable);

router.get('/', admincontroller.index);

module.exports = router;