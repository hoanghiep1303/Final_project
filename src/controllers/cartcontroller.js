const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class cartcontroller {
    addtocartfromshow(req, res, next) {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        Product.findById(productId, function (err, product) {
            if (err) {
                return res.redirect('/cart');
            }
            cart.addMultiple(product, product.id, req.body.value);
            req.session.cart = cart;
            res.redirect('/cart');
        })
    }
    addtocart(req, res, next) {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        Product.findById(productId, function (err, product) {
            if (err) {
                return res.redirect('/cart');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            res.redirect('/cart');
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
            Promise.all([
                User.findOne({ _id: decodeToken }),
                Notification.find({ user: decodeToken }).sort({ createdAt: -1 }),
            ])
                .then(([
                    user, noti,
                ]) => {
                    if (user) {
                        req.user = user
                        if (!req.session.cart) {
                            return res.render('cart', {
                                user: mongooseToObject(user),
                                noti: multipleMongooseToObject(noti),
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
                            cart: req.session.cart,
                            noti: multipleMongooseToObject(noti),
                        });
                    }

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
