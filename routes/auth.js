var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('auth/login', {title: 'Login — Raison'});
});

router.get('/signup', function(req, res, next) {
    res.render('auth/signup.ejs', {title: 'Sign Up — Raison'});
});

module.exports = router;