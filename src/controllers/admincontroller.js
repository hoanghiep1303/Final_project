const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');


const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class admincontroller {
    index(req, res) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'mytoken');
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
                        // layout: 'dashboard',
                    })

                })
                .catch(err => console.log(err))
        }
        else {
            res.redirect('/partials/error');
        }
    }
    create(req, res) {
        res.render('admin/createfood')
    }
    update(req, res) {
        Product.findOne({ _id: req.params.id })
            .then(product => {
                if (!product) {
                    res.render('admin/updatefood', {
                        msg: 'Product not found!'
                    })
                } else {
                    res.render('admin/updatefood', {
                        product: mongooseToObject(product),
                        messages: req.flash('success')
                    })
                }
            })
    }
    createCategory(req, res) {
        res.render('admin/createcategory')
    }
    updateCategory(req, res) {
        Category.findOne({ _id: req.params.id })
            .then(category => {
                if (!category) {
                    res.render('admin/updatecategory', {
                        msg: 'Category not found!'
                    })
                } else {
                    res.render('admin/updatecategory', {
                        category: mongooseToObject(category),
                        messages: req.flash('success')
                    })
                }
            })
    }
}

const res = require('express/lib/response');
module.exports = new admincontroller;