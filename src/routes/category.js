const express = require('express');
const router = express.Router();
const categorycontroller =require('../controllers/categorycontroller');


// router.post('/update/:id', categorycontroller.update);

// router.get('/delete/:id', categorycontroller.delete);

// router.post('/store', categorycontroller.store);

// router.get('/', categorycontroller.index);

// [PUT] /category/:id/update category
router.put('/:id', categorycontroller.update)

// [PATCH] /category/:id/update category
router.patch('/:id/restore', categorycontroller.restore)

// [DELETE] /category/:id/detele category
router.delete('/:id', categorycontroller.delete)
router.delete('/:id/force', categorycontroller.force)

// // [POST] /category/store category
router.post('/store', categorycontroller.store)


module.exports = router;