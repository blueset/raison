var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/login', function (req, res) {
    console.log('haiz');
    var message = req.flash('error')[0];
    res.render('auth/login', {title: 'Login— Raison', message: message});
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/signup', function(req, res, next) {
    res.render('auth/signup', {title: 'Sign Up — Raison'});
});

router.get('/forgot-password', function(req, res, next) {
    res.render('auth/forgot-password', {title: 'Password recovery — Raison'});
});

router.get('/email-confirm', function(req, res, next) {
    res.render('auth/email-confirm', {title: 'Email confirm — Raison'});
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;