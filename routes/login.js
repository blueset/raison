var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function (req, res) {
    res.locals.user = req.user;
    res.render('login_signup/login.ejs', {title: 'Login'});
});


router.post('/', passport.authenticate('local', {
    successRedirect: '../',
    failureRedirect: '/signup',
    failureFlash: true
}));



module.exports = router;