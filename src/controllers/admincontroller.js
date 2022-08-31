
const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');


const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class admincontroller {
    index(req, res) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'tokenabc');
            Promise.all([
                User.findOne({ _id: decodeToken }),
                Product.find({}),
            ])
                .then(([
                    user, product
                ]) => {

                    res.render('admin', {
                        user: mongooseToObject(user),
                        product: multipleMongooseToObject(product),

                    })

                })
                .catch(err => console.log(err))
        }
        else {
            res.redirect('/partials/error');
        }
    }
    create(req, res) {
        res.render('admin/create')
    }
    update(req, res) {
        Product.findOne({ _id: req.params.id })
            .then(product => {
                if (!product) {
                    res.render('admin/update', {
                        msg: 'Product not found!'
                    })
                } else {
                    res.render('admin/update', {
                        product: mongooseToObject(product)
                    })
                }
            })
    }
}

const res = require('express/lib/response');
module.exports = new admincontroller;