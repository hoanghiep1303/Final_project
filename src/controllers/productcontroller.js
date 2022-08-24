
const Product = require('../models/Product')

const {multipleMongooseToObject, mongooseToObject} = require ('../ulti/mongoose')

class productcontroller {
    index(req, res) {
        Product.find({}).limit(3)
        .then((product) => res.render('home', {
            product: multipleMongooseToObject(product)
        }))
        .catch(err => console.log(err))
    }

    store(req, res, next){
        var newProduct = new Product(req.body)
        newProduct.save((err, result) => {
            if (err){
                return res.render('admin/create',{
                    msg: 'Product created failed'
                })
            }
            next()
        })
        return (
            res.render('admin/create',{
                success: true,
                msg: 'Product created successfully'
            })
        )
    }

    delete(req,res){
        Product.deleteOne({_id: req.params.id})
        .then(product => {
            if(!product) {
                console.log('Product not found')
            } else {
                res.redirect('back')
            }
        })
        .catch(err => {console.log(err)})
    }

    update(req, res){
        Product.findOneAndUpdate({_id: req.params.id}, req.body)
        .then(product => {
            if(!product) {
                console.log('Product not found')
                res.redirect('back')
            } else{
                res.render('admin/update', {
                    msg: 'Product updated successfully',
                    success: true
                })
            }
        })
        // Brand.updateOne({_id: req.params.id}, req.body)
        //     .then(brand => res.redirect('back'))
        //     .catch(next);
    }

    show(req, res){
        Promise.all([
            Product.findById(req.params.id),
            Product.find({}).limit(4),
        ])
        .then(([product, listProduct]) =>{
            res.render('show', {
                product: mongooseToObject(product),
                listProduct: multipleMongooseToObject(listProduct),
            })
        })
        .catch((err)=>{console.log(err)})
    }
}

const res = require('express/lib/response');
module.exports = new productcontroller;