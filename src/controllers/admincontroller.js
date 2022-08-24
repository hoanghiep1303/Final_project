
const User = require('../models/User')
const Product = require('../models/Product')

const {multipleMongooseToObject, mongooseToObject} = require ('../ulti/mongoose')

class sitecontroller {
    index(req, res) {
        Product.find({})
        .then(listProduct => {
            res.render('admin', {
                listProduct: multipleMongooseToObject(listProduct)
            })
        })
    }
    create(req,res){
        res.render('admin/create')
    }
    update(req,res){
        Product.findOne({_id: req.params.id})
        .then(product =>{
            if(!product){
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
module.exports = new sitecontroller;