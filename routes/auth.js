var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('auth/login', {title: 'Login — Raison'});
});

router.get('/signup', function(req, res, next) {
    res.render('auth/signup', {title: 'Sign Up — Raison'});
});

router.get('/forgot-password', function(req, res, next) {
    res.render('auth/forgot-password', {title: 'Password recovery — Raison'});
});

router.get('/email-confirm', function(req, res, next) {
    res.render('auth/email-confirm', {title: 'Email confirm — Raison'});
});

module.exports = router;