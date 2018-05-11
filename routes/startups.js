var express = require('express');
var router = express.Router();

var userController = require('../controller/userController');

router.get('/', function (req, res, next) {
    res.render('startups/landing', { title: 'Startups — Raison' });
});

router.get('/:username', function (req, res, next) {
    userController.findUser(req.params['username'], function(user) {
        if (user) {
            res.locals.user = user;
            res.render('profile/profile', { title: 'Ronald Jackson — Startups — Raison' });
        } else {
            res.redirect('/startups', { message: 'User not found!'});
        }

    });
});

router.get('/information-technologies-web-project/1', function(req, res, next) {
    res.render('startups/project', { title: 'Project Name — Startups — Raison'});
});

module.exports = router;
