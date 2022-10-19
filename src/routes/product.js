const express = require('express');
const router = express.Router();
const productcontroller =require('../controllers/productcontroller');

var cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get('/show/:id', productcontroller.show);

router.post('/update/:id', productcontroller.update)

router.patch('/:id/restore', productcontroller.restore);

router.delete('/:id', productcontroller.delete);

router.delete('/:id/force', productcontroller.force);

router.post('/store', productcontroller.store);

router.get('/', productcontroller.index);

module.exports = router;