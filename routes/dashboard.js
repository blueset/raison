var express = require('express');
var router = express.Router();

router.get('/dashboard', function (req, res, next) {
    res.render('dashboard/dashboard', { title: 'Dashboard — Raison' });
});

router.get('/inbox', function (req, res, next) {
    res.render('dashboard/inbox', { title: 'Inbox (0) — Raison' });
});

router.get('/profile', function (req, res, next) {
    res.render('dashboard/profile', { title: 'Profile — Raison' });
});

router.get('/projects', function (req, res, next) {
    res.render('dashboard/projects', { title: 'Projects — Raison' });
});

router.get('/security', function (req, res, next) {
    res.render('dashboard/security', { title: 'Security — Raison' });
});

module.exports = router;
