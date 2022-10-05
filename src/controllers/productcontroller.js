
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Category = require('../models/Category');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class productcontroller {
    index(req, res) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'mytoken');
            Promise.all([
                User.findOne({ _id: decodeToken }),
                Product.find({}).limit(3),
                Category.find(),
            ])
                .then(([
                    user, product, category
                ]) => {
                    if (user) {
                        req.user = user
                        res.render('home', {
                            user: mongooseToObject(user),
                            product: multipleMongooseToObject(product),
                            category: multipleMongooseToObject(category),
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
                    category: multipleMongooseToObject(category),
                }))
                .catch(err => console.log(err))
        }
        // Product.find({}).limit(3)
        //     .then((product) => res.render('home', {
        //         product: multipleMongooseToObject(product)
        //     }))
        //     .catch(err => console.log(err))
    }

    store(req, res, next) {
        var newProduct = new Product({
            name: req.body.name,
            desc: req.body.desc,
            category: req.body.category,
            price: req.body.price,
            image: req.file.filename,
        })
        newProduct.save()
            .then(() => res.redirect('back'))
            .catch(error => {
                console.log(error)
            })
    }

    delete(req, res) {
        Product.deleteOne({ _id: req.params.id })
            .then(product => {
                if (!product) {
                    console.log('Product not found')
                } else {
                    res.redirect('back')
                }
            })
            .catch(err => { console.log(err) })
    }

    update(req, res) {
        console.log(req.body)
        Product.findOneAndUpdate({ _id: req.params.id }, req.body)
            .then(product => {
                if (!product) {
                    console.log('Product not found')
                    res.redirect('back')
                } else {
                    req.flash('success', 'Product update successfully');
                    res.redirect('back');
                }
            })
        // Brand.updateOne({_id: req.params.id}, req.body)
        //     .then(brand => res.redirect('back'))
        //     .catch(next);
    }

    show(req, res) {
        if (req.cookies.token) {
            var token = req.cookies.token;
            var decodeToken = jwt.verify(token, 'mytoken');
            Promise.all([
                User.findOne({ _id: decodeToken }),
                Product.findById(req.params.id),
                Product.find({}).limit(4),
            ])
                .then(([user, product, listProduct]) => {
                    if (user) {
                        req.user = user
                        res.render('show', {
                            user: mongooseToObject(user),
                            product: mongooseToObject(product),
                            listProduct: multipleMongooseToObject(listProduct),
                            cart: req.session.cart,
                        })
                    }
                })
                .catch((err) => { console.log(err) })
        } else {
            Promise.all([
                Product.findById(req.params.id),
                Product.find({}).limit(4),
            ])
                .then(([product, listProduct]) => {
                    res.render('show', {
                        product: mongooseToObject(product),
                        listProduct: multipleMongooseToObject(listProduct),
                    })
                })
                .catch((err) => { console.log(err) })
        }
    }
}

const res = require('express/lib/response');
module.exports = new productcontroller;