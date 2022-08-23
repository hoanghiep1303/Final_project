const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class sitecontroller {
    index(req, res) {
        res.render('home')
    }

    login(req, res) {
        res.render('login')
    }

    register(req, res) {
        res.render('register')
    }

    store(req, res) {
        console.log(req.body)

    }
}

const res = require('express/lib/response');
module.exports = new sitecontroller;