const express = require('express');
const router = express.Router();
const sitecontroller = require('../controllers/sitecontroller');
const User = require('../models/User');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const { isLoggined } = require('../ulti/login');

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


router.get('/', sitecontroller.index);

router.get('/login', sitecontroller.login);

router.post('/validate', sitecontroller.validate);

router.get('/register', sitecontroller.register);

router.post('/store', sitecontroller.store);

router.get('/error', sitecontroller.error);

router.get('/logout', sitecontroller.logout);

router.get('/checkout', isLoggined,sitecontroller.checkout);

router.get('/order', sitecontroller.order);
router.get('/order/search', sitecontroller.orderSearch);

router.post('/checkoutbyPaypal', sitecontroller.checkoutbyPaypal);

router.get('/checkoutsuccess', sitecontroller.checkoutsuccess);

router.get('/checkoutfail', sitecontroller.checkoutfail);

router.get('/profile', isLoggined,sitecontroller.profile);

router.get('/history', isLoggined,sitecontroller.history);

router.get('/notification', isLoggined,sitecontroller.notification);

router.get('/notification/read-all', isLoggined,sitecontroller.readAll);

//social-login-session
router.use(cookieParser());
router.use(passport.initialize());
router.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false
}));
router.use(passport.session());

//Google Auth routes
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
},
    function (accessToken, refreshToken, profile, done) {
        // return done(null, profile)
        process.nextTick(function () {

            User.findOne({ 'googleId': profile.id }, function (err, user) {
                console.log(profile)
                if (err)
                    return done(err);

                if (user) {
                    return done(null, user); 
                } else {
                    var newUser = new User();
                    newUser.googleId = profile.id; 
                    newUser.name = profile.displayName; 
                    newUser.email = profile.emails[0].value;
                    newUser.money = 0;
                    newUser.gender = profile.gender;
                    newUser.avatar = profile.photos[0].value;
                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }
            });
        })
    }
));
// Passport session setup.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
// Setup router for user request
router.get('/auth/google', passport.authenticate('google', { scope: 'email' }));
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/social-login-success', failureRedirect: '/login'
    }));

router.get('/social-login-success', function (req, res) {
    var token = jwt.sign({ _id: req.user.id }, 'mytoken', {})
    console.log(token);
    res.cookie('token', token);
    res.redirect('/')
})


//Facebook Auth routes
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        // return done(null, profile)
        process.nextTick(function () {

            User.findOne({ 'facebookId': profile.id }, function (err, user) {
                console.log(profile)
                if (err)
                    return done(err);

                if (user) {
                    return done(null, user); 
                } else {
                    var newUser = new User();
                    newUser.facebookId = profile.id; 
                    // newUser.email = profile.email;
                    newUser.name  = profile.displayName; 
                    newUser.money = 0;
                    newUser.gender = profile.gender;
                    newUser.avatar = profile.photos;
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }
            });
        })
    }
));
// Passport session setup.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
// Setup router for user request
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/social-login-success', failureRedirect: '/login'
    }))

router.get('/social-login-success', function (req, res) {
    var token = jwt.sign({ _id: req.user.id }, 'mytoken', {})
    res.cookie('token', token);
    res.redirect('/')
})

module.exports = router;