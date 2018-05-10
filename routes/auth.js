var express = require('express');
var router = express.Router();
var passport = require('passport');
var userController = require('../controller/userController');

const {check, body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

/* GET home page. */
router.get('/login', function (req, res) {
    var message = req.flash('error')[0];
    res.render('auth/login', {
        title: 'Log in — Raison', 
        message: message,
        userInput: req.flash('userInput')[0],
    });
});


router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    let redirectTo = req.session.redirectTo ? req.session.redirectTo : undefined;
    if (redirectTo !== undefined) {
        delete req.session.redirectTo;
        res.redirect(redirectTo);
    } else {
        const redirectionMapping = {
            "Startup": "/investors",
            "Investor": "/startups",
            "Donator": "/investors",
            "Investor": "/donators"
        }
        res.redirectTo(redirectionMapping[req.user.role]);
    }
});

router.get('/signup', function (req, res, next) {
    res.render('auth/signup', {title: 'Sign Up — Raison', errors: null});
});


router.post('/signup', [
    check('displayname').exists(),
    check('username')
    .isLength({min: 6, max: 32})
    .custom(async (value) => {
        var x = new Promise((resolve, reject) => {
            userController.findUser(value, function (user) {
                resolve(user);
            })
        });
        var user = await x;
        console.log(user);
        return user == null;
    }).withMessage('User is already taken!'),
    check('email')
        .isEmail().withMessage("Email entered is not valid.").trim().normalizeEmail()
        .custom(async (value) => {
        var x = new Promise((resolve, reject) => {
            userController.findUser(value, function (user) {
                resolve(user);
            })
        });
        var user = await x;
        return user == null;
    }).withMessage('Email is already taken!'),
    check('password').exists().isLength({min: 6}),
    check('confirm_password')
        .exists()
        .custom((value, {req}) => value === req.body.password)
        .withMessage('Password confirmation field must have the same value as the password field')
], function (req, res, next) {
    const errors = validationResult(req).mapped();
    
    console.log(errors);
    console.log("SIGN_IN REQ BODY", req.body);
    if (Object.keys(errors).length != 0)
        res.render('auth/signup', {title: 'Sign Up — Raison', errors: errors, userInput: req.body});
    else {
        userController.createUser(req, function (saved) {
            if (saved) res.redirect('/email-confirm');
        });
    }
});

router.get('/current-user', function(req, res) {
    if (!req.user) {
        res.json({});
    } else {
        res.json({
           username: req.user.authentication.username
        });
    }
});


router.get('/forgot-password', function (req, res, next) {
    res.render('auth/forgot-password', {title: 'Password recovery — Raison'});
});

router.get('/email-confirm', function (req, res, next) {
    res.render('auth/email-confirm', {title: 'Email confirm — Raison'});
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/signup/error', function(req, res) {
    res.render('auth/temporary-error', {title: 'Sign up - Errors'});
})


router.get('/getUser/:id', function (req, res) {
    userController.findUser2(req.params.username, function (user) {
        res.json({'user': user});
    });
});

router.get('/checkUser/:username', function (req, res) {
    var exist;
    userController.findUser(req.params.username, function (user) {
        if (user) exist = true;
        else exist = false;
        res.json({'exist': exist});
    });
});

router.get('/checkEmail/:email', function (req, res) {
    var exist;
    userController.findUser(req.params.email, function (user) {
        if (user) exist = true;
        else exist = false;
        res.json({'exist': exist});
    });
});

module.exports = router;