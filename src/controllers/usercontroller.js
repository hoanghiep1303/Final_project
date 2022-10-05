const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose');

class usercontroller {
    // [PUT] /user/:id 
    update(req, res, next) {
        User.findOneAndUpdate({_id: req.params.id}, {$set: req.body})
            .then(() => {
                var noti = new Notification({
                    user: req.params.id,
                    desc: 'Your profile has been updated.' 
                })
                noti.save()
                req.flash('successMsg', 'Your profile information has been updated'),
                res.redirect('/user/profile')
            })
            .catch(next);
    }

    // [POST] /user/change-avatar
    changeAvatar(req, res, next) {
        User.findOneAndUpdate({_id: req.params.id}, {$set: {avatar: req.file.filename}})
            .then(() => {
                var noti = new Notification({
                    user: req.params.id,
                    desc: 'Avatar changed.' 
                })
                noti.save()
                req.flash('successMsg', 'Your avatar has been updated'),
                res.redirect('/user/profile')
            })
            .catch(next);
    }
}

const res = require('express/lib/response');
module.exports = new usercontroller;