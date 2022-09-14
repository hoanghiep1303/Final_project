const Category = require('../models/Category');
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class categorycontroller {
    index(req, res) {
        Category.find({}).limit(3)
            .then((category) => res.render('home', {
                category: multipleMongooseToObject(category)
            }))
            .catch(err => console.log(err))
    }

    store(req, res, next) {
        var newCategory = new Category(req.body)
        console.log(newCategory);
        newCategory.save((err, result) => {
            if (err) {
                return res.render('admin/createcategory', {
                    msg: 'Category created failed'
                })
            }
            // next()
        })
        return (
            res.render('admin/createcategory', {
                success: true,
                msg: 'Category created successfully'
            })
        )
    }

    delete(req, res) {
        Category.deleteOne({ _id: req.params.id })
            .then(category => {
                if (!category) {
                    console.log('Category not found')
                } else {
                    res.redirect('back')
                }
            })
            .catch(err => { console.log(err) })
    }

    update(req, res) {
        Category.findOneAndUpdate({ _id: req.params.id }, req.body)
            .then(category => {
                if (!category) {
                    console.log('Category not found')
                    res.redirect('back')
                } else {
                    req.flash('success', 'Category update successfully');
                    res.redirect('back');
                }
            })
        // Brand.updateOne({_id: req.params.id}, req.body)
        //     .then(brand => res.redirect('back'))
        //     .catch(next);
    }
}

const res = require('express/lib/response');
module.exports = new categorycontroller;