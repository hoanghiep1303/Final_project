const express = require('express');
const router = express.Router();
const cartcontroller = require('../controllers/cartcontroller');

router.post('/add-to-cart-from-show/:id', cartcontroller.addtocartfromshow);

router.get('/add-to-cart/:id', cartcontroller.addtocart);

router.get('/reduce/:id', cartcontroller.reduce);

router.get('/remove/:id', cartcontroller.remove);

router.get('/', cartcontroller.cart);

module.exports = router;