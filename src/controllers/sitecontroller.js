const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User')
const Product = require('../models/Product')

const {multipleMongooseToObject, mongooseToObject} = require ('../ulti/mongoose')

class sitecontroller {
    index(req, res) {
        Product.find({}).limit(3)
        .then((product) => res.render('home', {
            product: multipleMongooseToObject(product)
        }))
        .catch(err => console.log(err))
    }

    login(req, res) {
        res.render('login')
    }

    register(req, res) {
        res.render('register')
    }

    error(req, res) {
        res.render('partials/error')
    }

    store(req, res) {
        User.findOne({email : req.body.email})
        .then(user => {
            if (user) {
                console.log('1')
                res.render('register', {
                    failMsg: 'Email is already exist!',
                })
            } else if(req.body.confirmPassword != req.body.password) {
                console.log('2')
                res.render('register', {
                    failMsg: 'Password does not match!',
                })
            } else {
                console.log('3')
                var temp = req.body.password
                bcrypt.hash(temp, 10, (err,hash) => {
                    const newUser = new User({
                        email: req.body.email,
                        password: hash,
                        // role: 
                    })
                    newUser.save(err, result => {
                        if(err) {
                            res.render('register', {
                                failMsg: 'Server ERR!',
                            })
                        }
                    })
                    return res.redirect('/login')
                })
            }
        })
    }

    validate(req, res){
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                res.render('login', {
                    failMsg: 'Email is not exist!'
                })
            }
            else {
                var temp = req.body.password;
                bcrypt.compare(temp, user.password, (err, result) => {
                    if(result){
                        res.render('login', {
                            failMsg: 'Thanh cong'
                        })
                    } else {
                        res.render('login', {
                            failMsg: 'Password is incorrect'
                        })
                    }
                })
            }
        })
    }
}

const res = require('express/lib/response');
module.exports = new sitecontroller;