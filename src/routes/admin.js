const express = require('express');
const router = express.Router();
const admincontroller =require('../controllers/admincontroller');

router.get('/product/create', admincontroller.create);
router.get('/product/update/:id', admincontroller.update);
// router.get('/product/delete', admincontroller.delete);
router.get('/', admincontroller.index);

module.exports = router;