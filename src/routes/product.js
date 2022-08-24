const express = require('express');
const router = express.Router();
const productcontroller =require('../controllers/productcontroller');


router.get('/show/:id', productcontroller.show);

router.post('/update/:id', productcontroller.update);

router.get('/delete/:id', productcontroller.delete);

router.post('/store', productcontroller.store);

router.get('/', productcontroller.index);

module.exports = router;