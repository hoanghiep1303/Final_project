const express = require('express');
const router = express.Router();
const admincontroller =require('../controllers/admincontroller');
const cookieParser = require('cookie-parser');
const { isLoggined, isAdmin } = require('../ulti/login');

router.use(cookieParser());

router.get('/product/create', admincontroller.create);
router.get('/product/update/:id', admincontroller.update);
// router.get('/product/delete', admincontroller.delete);

router.get('/category/create', admincontroller.createCategory);
router.get('/category/update/:id', admincontroller.updateCategory);

router.use('/product-mgmt', isLoggined, isAdmin, admincontroller.productTable)
router.use('/category-mgmt', isLoggined, isAdmin, admincontroller.categoryTable)
router.use('/user-mgmt', isLoggined, isAdmin, admincontroller.userTable)

router.get('/', admincontroller.index);

module.exports = router;