const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');


const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class admincontroller {
    index(req, res) {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'mytoken');
        Promise.all([
            User.findOne({ _id: decodeToken }),
            Product.find({}),
            Category.find(),
        ])
            .then(([
                user, product, category
            ]) => {

                res.render('admin', {
                    user: mongooseToObject(user),
                    product: multipleMongooseToObject(product),
                    category: multipleMongooseToObject(category),
                    layout: 'dashboard',
                })

            })
            .catch((error) => {
                console.error(error);
                res.redirect('/login')
            })
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

    productTable(req, res, next) {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'mytoken');
        Promise.all([
            User.findOne({ _id: decodeToken }),
            Category.find(),
            Product.find({}).populate('category')
        ])
            .then(([
                user, category, product
            ]) => {
                res.render('admin/product-mgmt', {
                    user: mongooseToObject(user),
                    category: multipleMongooseToObject(category),
                    product: multipleMongooseToObject(product),
                    layout: 'dashboard',
                })

            })
            .catch((error) => {
                console.error(error);
                //res.redirect('/login')
            })
    }

    categoryTable(req, res, next) {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'mytoken');
        Promise.all([
            User.findOne({ _id: decodeToken }),
            Category.find(),
        ])
            .then(([
                user, category
            ]) => {
                res.render('admin/category-mgmt', {
                    user: mongooseToObject(user),
                    category: multipleMongooseToObject(category),
                    layout: 'dashboard',
                })

            })
            .catch((error) => {
                console.error(error);
                res.redirect('/login')
            })
    }

    userTable(req, res, next) {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'mytoken');
        Promise.all([
            User.findOne({ _id: decodeToken }),
            Category.find(),
            User.find(),
        ])
            .then(([
                user, category, users
            ]) => {

                res.render('admin/user-mgmt', {
                    user: mongooseToObject(user),
                    users: multipleMongooseToObject(users),
                    category: multipleMongooseToObject(category),
                    layout: 'dashboard',
                })

            })
            .catch((error) => {
                console.error(error);
                res.redirect('/login')
            })
    }
}

const res = require('express/lib/response');
module.exports = new admincontroller;