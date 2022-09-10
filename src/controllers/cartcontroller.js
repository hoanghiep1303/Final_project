const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class cartcontroller {
    addtocart(req, res, next) {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        Product.findById(productId, function (err, product) {
            if (err) {
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            res.redirect('/');
        })
    }
    reduce(req, res, next) {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.reduceByOne(productId);
        req.session.cart = cart;
        res.redirect('/cart');
    }
    remove(req, res, next) {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.removeItem(productId);
        req.session.cart = cart;
        res.redirect('/cart');
    }
    cart(req, res, next) {
        if (req.cookies.token) {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'mytoken');
            User.findOne({ _id: decodeToken })
            .then(user => {
                    req.user = user
                    if (!req.session.cart) {
                        return res.render('cart', { 
                            user: mongooseToObject(user),
                            products: null,
                            messages: req.flash('success'),
                            success: true,
                        });
                    }
                    const cart = new Cart(req.session.cart);
                    return res.render('cart', { 
                        user: mongooseToObject(user),
                        products: cart.generateArray(), 
                        totalPrice: cart.totalPrice,
                        messages: req.flash('error'),
                    });
                })
            .catch(err => console.log(err))
        }
        else {
            res.redirect('/error');
        }
    }
};

const res = require('express/lib/response');
module.exports = new cartcontroller;
