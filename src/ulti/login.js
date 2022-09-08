const User = require('../models/User')
const jwt = require('jsonwebtoken');
// const { mongooseToObject } = require('./mongoose');


function isLoggined(req, res, next) {
    try {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'mytoken');
        User.findOne({_id: decodeToken})
        .then(data => {
            if (data) {
                req.data = data;
                req.session.url = req.url;
                // console.log(data)
                next()
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect('/')
        })
    } catch (error) {
        console.log(error)
        return res.render('login',{
            // msgLog: 'You need to login first',
            // layout: 'loginLayout',
            title: 'Login'
        })
    }
}

function isAdmin(req, res, next) {
    // console.log(req.cookies.token);
    if (req.data.role !== 'Admin') {
        User.findOne({ email: req.data.email })
            .then(user => {
                res.redirect('/error')
            })
    }
    next()
}

function isCustomer(req, res, next) {
    if (req.data.role !== 'Customer') {
        User.findOne({ email: req.data.email })
            .then(user => {
                res.redirect('/error')
            })
    }
    next()
}

module.exports = { isLoggined, isAdmin, isCustomer }
