const express = require('express');
const router = express.Router();
const categorycontroller =require('../controllers/categorycontroller');


router.post('/update/:id', categorycontroller.update);

router.get('/delete/:id', categorycontroller.delete);

router.post('/store', categorycontroller.store);

router.get('/', categorycontroller.index);

module.exports = router;