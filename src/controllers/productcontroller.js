
const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class productcontroller {
    index(req, res) {
        Product.find({}).limit(3)
            .then((product) => res.render('home', {
                product: multipleMongooseToObject(product)
            }))
            .catch(err => console.log(err))
    }

    store(req, res, next) {
        var newProduct = new Product(req.body)
        console.log(newProduct);
        newProduct.save((err, result) => {
            if (err) {
                return res.render('admin/createfood', {
                    msg: 'Product created failed'
                })
            }
            // next()
        })
        return (
            res.render('admin/createfood', {
                success: true,
                msg: 'Product created successfully'
            })
        )
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