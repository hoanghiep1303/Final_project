const express = require('express');
const router = express.Router();
const admincontroller =require('../controllers/admincontroller');
const cookieParser = require('cookie-parser');


router.use(cookieParser());

router.get('/product/create', admincontroller.create);
router.get('/product/update/:id', admincontroller.update);
// router.get('/product/delete', admincontroller.delete);

router.get('/category/create', admincontroller.createCategory);
router.get('/category/update/:id', admincontroller.updateCategory);
router.get('/', admincontroller.index);

module.exports = router;