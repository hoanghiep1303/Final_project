const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose');

class usercontroller {
    // [PUT] /user/:id 
    update(req, res, next) {
        User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
            .then(() => {
                // var noti = new Notification({
                //     user: req.params.id,
                //     desc: 'Your profile has been updated.' 
                // })
                // noti.save()
                req.flash('successMsg', 'Your profile information has been updated'),
                    res.redirect('back')
            })
            .catch(next);
    }

    // [POST] /user/change-avatar
    changeAvatar(req, res, next) {
        User.findOneAndUpdate({ _id: req.params.id }, { $set: { avatar: req.file.filename } })
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

    changePassword(req, res, next) {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'mysecret')

        const currentPassword = req.body.currentPassword
        const newPassword = req.body.newPassword
        const confirmPassword = req.body.confirmPassword

        User.findOne({ _id: decodeToken })
            .then(user => {
                bcrypt.compare(currentPassword, user.password, function (err, result) {
                    if (result) {
                        if (newPassword != confirmPassword) {
                            // req.flash('error', 'Password does not match'),
                            res.redirect('back', {
                                message: req.flash('error', 'Password does not match'),
                            })
                        }
                        else if (currentPassword == newPassword) {
                            // req.flash('error', 'Password must not be the same as the old password'),
                            res.redirect('back', {
                                messages: req.flash('error', 'Password must not be the same as the old password'),
                            })
                        }
                        else {
                            bcrypt.hash(newPassword, 10, function (error, hash) {
                                if (error) {
                                    // req.flash('error', 'Change password failed'),
                                    res.redirect('back', {
                                        messages: req.flash('error', 'Change password failed'),
                                    })
                                }
                                User.updateOne({ _id: decodeToken }, { $set: { password: hash } }, (err, status) => {
                                    if (err) {
                                        // req.flash('error', 'Change password failed'),
                                        res.redirect('back', {
                                            messages: req.flash('error', 'Change password failed'),
                                        })
                                    }
                                    // req.flash('success', 'Change password successfully'),
                                    res.redirect('back', {
                                        messages: req.flash('success', 'Change password successfully'),
                                    })
                                })
                            });
                        }
                    } else {
                        return res.redirect('back', {
                            message: req.flash('error', 'Old password is invalid'),
                        })
                    }
                })
            })
            
    }
}

const res = require('express/lib/response');
module.exports = new usercontroller;