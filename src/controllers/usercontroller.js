const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { multipleMongooseToObject, mongooseToObject } = require('../ulti/mongoose');

class usercontroller {
    // [PUT] /user/:id 
    update(req, res, next) {
        var userId = req.params.id
        User.findOneAndUpdate({ _id: userId }, { $set: req.body })
            .then(() => {
                var noti = new Notification({
                    user: userId,
                    status: true,
                    desc: 'Your profile has been updated.' 
                })
                noti.save()
                req.flash('successMsg', 'Your profile information has been updated'),
                    res.redirect('/profile')
            })
            .catch(next);
    }

    // [POST] /user/change-avatar
    changeAvatar(req, res, next) {
        var userId = req.params.id
        User.findOneAndUpdate({ _id: userId }, { $set: { avatar: req.file.filename } })
            .then(() => {
                var noti = new Notification({
                    user: userId,
                    desc: 'Avatar changed.',
                    status: true
                })
                noti.save()
                req.flash('successMsg', 'Your avatar has been updated'),
                    res.redirect('/profile')
            })
            .catch(next);
    }

    changePassword(req, res, next) {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, 'mytoken')

        const currentPassword = req.body.currentPassword
        const newPassword = req.body.newPassword
        const confirmPassword = req.body.confirmPassword
        
        User.findOne({ _id: decodeToken })
            .then(user => {
                bcrypt.compare(currentPassword, user.password, function (err, result) {
                    if (result) {
                        if (newPassword != confirmPassword) {
                            console.log('error'+ 'Password does not match'),
                            res.redirect('back')
                        }
                        else if (currentPassword == newPassword) {
                            console.log('error'+ 'Password must not be the same as the old password'),
                            res.redirect('back')
                        }
                        else {
                            bcrypt.hash(newPassword, 10, function (error, hash) {
                                if (error) {
                                    console.log('error'+ 'Change password failed'),
                                    res.redirect('back')
                                }
                                User.updateOne({ _id: decodeToken }, { $set: { password: hash } }, (err, status) => {
                                    if (err) {
                                        console.log('error'+ 'Change password failed'),
                                        res.redirect('back')
                                    }
                                    var noti = new Notification({
                                        user: decodeToken,
                                        status: true,
                                        desc: 'Change password successfully' 
                                    })
                                    noti.save()
                                    res.redirect('back')
                                })
                            });
                        }
                    } else {
                        console.log('error'+ 'Old password is invalid')
                        return res.redirect('back')
                    }
                })
            })
    }
}

const res = require('express/lib/response');
module.exports = new usercontroller;