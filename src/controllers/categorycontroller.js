const Category = require('../models/Category');
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose')

class categorycontroller {
    update(req, res, next) {
        Category.findOneAndUpdate({ _id: req.params.id }, req.body)
            .then(category => res.redirect('back'))
            .catch(next);
    }

    delete(req, res, next) {
        Category.findOneAndUpdate({ _id: req.params.id }, {deleted: true})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    force(req, res, next) {
        Category.findOneAndDelete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);

    }

    restore(req, res, next) {
        Category.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);

    }

    store(req, res, next) {
        const newCategory = new Category({
            name: req.body.name,
            image: req.file.filename,
        });
        newCategory.save()
            .then(() => res.redirect('back'))
            .catch(error => {
                console.log(error)
            })
    }
}

const res = require('express/lib/response');
module.exports = new categorycontroller;