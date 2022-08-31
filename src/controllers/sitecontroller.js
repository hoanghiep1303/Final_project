const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User')
const Product = require('../models/Product')

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class sitecontroller {
    index(req, res) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'tokenabc');
            Promise.all([

                User.findOne({ _id: decodeToken }),
                Product.find({}).limit(3),
            ])
                .then(([
                    user, product
                ]) => {
                    if (user) {
                        req.user = user
                        res.render('home', {
                            user: mongooseToObject(user),
                            product: multipleMongooseToObject(product),
                        })
                        // next()
                    }

                })
                .catch(err => console.log(err))
        }
        else {
            Product.find({}).limit(3)
                .then((product) => res.render('home', {
                    product: multipleMongooseToObject(product)
                }))
                .catch(err => console.log(err))
        }

        // Product.find({}).limit(3)
        //     .then((product) => res.render('home', {
        //         product: multipleMongooseToObject(product)
        //     }))
        //     .catch(err => console.log(err))
    }

    login(req, res, next) {
        if (!req.cookies.token) {
            res.render('login', {
                // failMsg: 'Invalid token'
            });
        }
        else {
            res.redirect('/')
        }
    }

    // login(req, res) {
    //     res.render('login')
    // }

    register(req, res) {
        if (req.cookies.token) {
            return res.redirect('/');
        }
        else {
            return res.redirect('register');
        }
    }

    // error(req, res) {
    //     res.render('partials/error')
    // }

    //REGISTER
    store(req, res) {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error', 'Email is already exist!');
                    res.redirect('register');
                    // res.render('register', {
                    //     failMsg: 'Email is already exist!',
                    // })
                } else if (req.body.confirmPassword != req.body.password) {
                    req.flash('error', 'Password does not match!');
                    res.redirect('register');
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
                                res.redirect('register');
                                // res.render('register', {
                                //     failMsg: 'Server ERR!',
                                // })
                            }
                        })
                        return res.redirect('/login')
                    })
                    // var token = jwt.sign({ _id: user.id }, 'tokenabc');
                    // res.cookie('token', token, { maxAge: 2147483647, httpOnly: true });
                }
            })
    }

    login(req, res, next) {
        if (!req.cookies.token) {
            res.render('login', {
                // failMsg: 'Invalid token'
            });
        }
        else {
            res.redirect('/')
        }
    }

    validate(req, res) {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'Email is not exist!');
                    res.redirect('login');
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
                            var token = jwt.sign({ _id: user.id }, 'tokenabc');
                            res.cookie('token', token, { maxAge: 2147483647, httpOnly: true });
                            return res.redirect('/');
                        } else {
                            req.flash('error', 'Password is incorrect');
                            res.redirect('login');
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
            var decodeToken = jwt.verify(token, 'tokenabc')
            User.findOne({
                _id: decodeToken
            }).then(user => {
                if (user) {
                    req.user = user
                    // console.log(user)
                    return res.render('partials/error',
                        {
                            user: mongooseToObject(user),
                        })
                }
            })
        }
        else {
            res.render('partials/error', {
                title: 'Not Found',
                // layout: null
            });
        }
    }

    //LOG OUT
    logout(req, res) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

const res = require('express/lib/response');
module.exports = new sitecontroller;