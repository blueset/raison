var express = require('express');
var router = express.Router();

var db = require('../models/db');

var userController = require('../controller/userController');

router.get('/dashboard', function (req, res, next) {
    res.render('dashboard/dashboard', { title: 'Dashboard — Raison' });
});

router.get('/inbox', function (req, res, next) {
    res.render('dashboard/inbox', { title: 'Inbox (0) — Raison' });
});

router.get('/profile', function (req, res, next) {
    res.render('dashboard/profile', { title: 'Profile — Raison' });
});

router.post('/profile', function(req, res, next) {
    res.locals.user.name = req.body.displayname;
    res.locals.user.bio = req.body.bio;
    res.locals.user.role = req.body.role;

    userController.saveUser(res.locals.user, function(successful) {
        if (successful) {
            res.locals.message = "successfully updated the profile!";
            res.render('dashboard/profile', { title: 'Profile — Raison' });
        } else {
            res.locals.message = "Cannot update your profile!";
            res.render('dashboard/profile', { title: 'Profile — Raison' });
        }
    })
});

router.get('/projects', function (req, res, next) {
    res.locals.projects = db.getProjectUser(res.locals.user.username);
    res.render('dashboard/projects', { title: 'Projects — Raison' });
});

router.get('/security', function (req, res, next) {
    res.render('dashboard/security', { title: 'Security — Raison' });
});

module.exports = router;
