const express = require('express');
const router = express.Router();
const sitecontroller = require('../controllers/sitecontroller');
const User = require('../models/User');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


router.get('/', sitecontroller.index);

router.get('/login', sitecontroller.login);

router.post('/validate', sitecontroller.validate);

router.get('/register', sitecontroller.register);

router.post('/store', sitecontroller.store);

router.get('/error', sitecontroller.error);

router.get('/logout', sitecontroller.logout);

router.get('/checkout', sitecontroller.checkout);

router.get('/order', sitecontroller.order);

router.post('/checkoutbyPaypal', sitecontroller.checkoutbyPaypal);

router.get('/checkoutsuccess', sitecontroller.checkoutsuccess);

router.get('/checkoutfail', sitecontroller.checkoutfail);

router.get('/profile', sitecontroller.profile);

router.get('/history', sitecontroller.history);

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

            // find the user in the database based on their google id
            User.findOne({ 'googleId': profile.id }, function (err, user) {
                console.log(profile)
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that google id, create them
                    var newUser = new User();
                    // set all of the google information in our user model
                    newUser.googleId = profile.id; // set the users google id           
                    newUser.name = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value;
                    newUser.money = 0;
                    newUser.gender = profile.gender;
                    newUser.avatar = profile.photos[0].value;
                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
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

            // find the user in the database based on their facebook id
            User.findOne({ 'facebookId': profile.id }, function (err, user) {
                console.log(profile)
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();
                    newUser.facebookId = profile.id; // set the users facebook id
                    // newUser.email = profile.email;
                    // set all of the facebook information in our user model           
                    newUser.name  = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.money = 0;
                    newUser.gender = profile.gender;
                    newUser.avatar = profile.photos;
                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
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