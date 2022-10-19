const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Cart = require('../models/Cart');
const Notification = require('../models/Notification');
const paypal = require('paypal-rest-sdk');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class sitecontroller {
    index(req, res) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'mytoken');
            Promise.all([
                User.findOne({ _id: decodeToken }),
                Product.find({}).limit(6),
                Category.find(),
                Notification.find({user: decodeToken}).sort({createdAt: -1}),
            ])
                .then(([
                    user, product, category, noti
                ]) => {
                    if (user) {
                        req.user = user
                        res.render('home', {
                            user: mongooseToObject(user),
                            product: multipleMongooseToObject(product),
                            category: multipleMongooseToObject(category),
                            noti: multipleMongooseToObject(noti),
                            cart: req.session.cart,
                        })
                        // next()
                    }

                })
                .catch(err => console.log(err))
        }
        else {
            Product.find({}).limit(3)
                .then((product) => res.render('home', {
                    product: multipleMongooseToObject(product),
                }))
                .catch(err => console.log(err))
        }
    }

    login(req, res, next) {
        if (!req.cookies.token) {
            res.render('login');
        }
        else {
            res.redirect('/');
        }
    }

    register(req, res, next) {
        if (!req.cookies.token) {
            res.render('register');
        }
        else {
            res.redirect('/');
        }
    }

    //REGISTER USER
    store(req, res) {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error', 'Email is already exist!');
                    res.redirect('/register');
                    // res.render('register', {
                    //     failMsg: 'Email is already exist!',
                    // })
                } else if (req.body.confirmPassword != req.body.password) {
                    req.flash('error', 'Password does not match!');
                    res.redirect('/register');
                    // res.render('register', {
                    //     failMsg: 'Password does not match!',
                    // })
                } else {
                    var temp = req.body.password
                    bcrypt.hash(temp, 10, (err, hash) => {
                        const newUser = new User({
                            email: req.body.email,
                            password: hash,
                            // role: 
                        })
                        newUser.save(err, result => {
                            if (err) {
                                req.flash('error', 'Server ERR!');
                                res.redirect('/register');
                                // res.render('register', {
                                //     failMsg: 'Server ERR!',
                                // })
                            }
                        })
                        return res.redirect('/login')
                    })
                }
            })
    }

    //LOGIN USER
    validate(req, res) {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'Email is not exist!');
                    res.redirect('/login');
                    // res.render('login', {
                    //     failMsg: 'Email is not exist!'
                    // })
                }
                else {
                    var temp = req.body.password;
                    bcrypt.compare(temp, user.password, (err, result) => {
                        // if(result){
                        //     res.render('login', {
                        //         failMsg: 'Thanh cong'
                        //     })
                        // } else {
                        //     res.render('login', {
                        //         failMsg: 'Password is incorrect'
                        //     })
                        // }
                        if (result) {
                            var token = jwt.sign({ _id: user.id }, 'mytoken');
                            res.cookie('token', token, { maxAge: 2147483647, httpOnly: true });
                            return res.redirect('/');
                        } else {
                            req.flash('error', 'Password is incorrect');
                            res.redirect('/login');
                            // return res.render('login', {
                            //     failMsg: 'Password is incorrect'
                            // })
                        }
                    })
                }
            })
    }

    //Not Found
    error(req, res, next) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'mytoken')
            User.findOne({
                _id: decodeToken
            }).then(user => {
                if (user) {
                    req.user = user
                    // console.log(user)
                    return res.render('error',
                        {
                            user: mongooseToObject(user),
                        })
                }
            })
        }
        else {
            res.render('error');
        }
    }

    //LOG OUT
    logout(req, res) {
        res.clearCookie('token');
        return res.redirect('/login');
    }

    checkout(req, res, next) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'mytoken');
            User.findOne({ _id: decodeToken })
                .then(user => {
                    req.user = user
                    if (!req.session.cart) {
                        return res.render('checkout', {
                            user: mongooseToObject(user),
                            products: null,
                        });
                    }
                    const cart = new Cart(req.session.cart);
                    return res.render('checkout', {
                        user: mongooseToObject(user),
                        products: cart.generateArray(),
                        totalPrice: cart.totalPrice,
                        cart: req.session.cart,
                    });
                })
                .catch(err => console.log(err))
        }
        else {
            res.redirect('/error');
        }
    }

    checkoutbyPaypal(req, res, next) {
        const userId = req.body.userId;
        const cart = new Cart(req.session.cart);
        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': 'Ab9ADnUFlhhvW_yM_7RakcfMJ3LoVD9k7BAP4DM2EpaYG8OYVzSrM92z59FZ4VlSkSzzDF-2H9k4KEuV',
            'client_secret': 'EEIpWJBixDOxpOqEreH5csgxM8SOunzVCq40fM_yAkdAW8M5wHDg4u1fZT1iVQdPkL_VbhTB3Vkukdrn'
        });
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/checkoutsuccess?userId=" + userId + '&totalPrice=' + cart.totalPrice,
                "cancel_url": "http://localhost:5000/checkoutfail?userId="+ userId + '&totalPrice=' + cart.totalPrice,
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": cart.totalPrice,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": cart.totalPrice
                },
                "description": "Washing Bar soap"
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
    }

    order(req, res, next) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'mytoken');
            Promise.all([
                User.findOne({ _id: decodeToken }),
                Product.find({}).limit(),
                Notification.find({user: decodeToken}).sort({createdAt: -1}),
            ])
                .then(([
                    user, product, noti
                ]) => {
                    if (user) {
                        req.user = user
                        res.render('order', {
                            user: mongooseToObject(user),
                            product: multipleMongooseToObject(product),
                            noti: multipleMongooseToObject(noti),
                            cart: req.session.cart,
                        })
                        // next()
                    }

                })
                .catch(err => console.log(err))
        }
        else {
            Product.find({}).limit()
                .then((product) => res.render('order', {
                    product: multipleMongooseToObject(product)
                }))
                .catch(err => console.log(err))
        }
    }

    checkoutsuccess(req, res, next) {
        req.session.cart = null;
        req.flash('success', 'Checkout successfully!')
        var noti = new Notification({
            user: req.query.userId,
            amount: req.query.totalPrice,
            status: true,
            desc: 'Checkout by Paypal success.' 
        })
        noti.save()
        return res.redirect('/cart');
    }

    checkoutfail(req, res, next) {
        req.flash('error', 'Checkout failed!')
        var noti = new Notification({
            user: req.query.userId,
            amount: req.query.totalPrice,
            status: false,
            desc: 'Checkout by Paypal failed.' 
        })
        noti.save()
        return res.redirect('/cart');
    }

    profile(req, res, next) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'mytoken');
            Promise.all([

                User.findOne({ _id: decodeToken }),
                Product.find({}).limit(3),
            ])
                .then(([
                    user, product
                ]) => {
                    if (user) {
                        req.user = user
                        res.render('profile', {
                            user: mongooseToObject(user),
                            product: multipleMongooseToObject(product),
                            cart: req.session.cart,
                        })
                        // next()
                    }

                })
                .catch(err => console.log(err))
        }
        else {
            Product.find({}).limit(3)
                .then((product) => res.render('profile', {
                    product: multipleMongooseToObject(product)
                }))
                .catch(err => console.log(err))
        }
    }

    history(req, res, next) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'mytoken');
            Promise.all([

                User.findOne({ _id: decodeToken }),
                Product.find({}).limit(3),
                Notification.find({user: decodeToken}).sort({createdAt: -1}),
            ])
                .then(([
                    user, product, noti
                ]) => {
                    if (user) {
                        req.user = user
                        res.render('history', {
                            user: mongooseToObject(user),
                            product: multipleMongooseToObject(product),
                            noti: multipleMongooseToObject(noti),
                            cart: req.session.cart,
                        })
                        // next()
                    }

                })
                .catch(err => console.log(err))
        }
        else {
            Product.find({}).limit(3)
                .then((product) => res.render('history', {
                    product: multipleMongooseToObject(product)
                }))
                .catch(err => console.log(err))
        }
    }
};

const res = require('express/lib/response');
module.exports = new sitecontroller;