var express = require('express');
var router = express.Router();

var db = require('../models/db');

router.get('/dashboard', function (req, res, next) {
    res.render('dashboard/dashboard', { title: 'Dashboard — Raison' });
});

router.get('/inbox', function (req, res, next) {
    res.render('dashboard/inbox', { title: 'Inbox (0) — Raison' });
});

router.get('/inbox/new', function (req, res, next) {
    res.render('dashboard/thread-new', { title: 'New thread — Raison' });
});

router.get('/inbox/:id', function (req, res, next) {
    res.render('dashboard/thread-detail', { title: 'Queries regarding your project Lorem Ipsum — Raison' });
});

router.get('/profile', function (req, res, next) {
    res.render('dashboard/profile', { title: 'Profile — Raison' });
});

router.get('/projects', function (req, res, next) {
    res.locals.projects = db.getProjectUser(res.locals.user.username);
    res.render('dashboard/projects', { title: 'Projects — Raison' });
});

router.get('/projects/new', function (req, res, next) {
    res.render('dashboard/projects-edit', { title: 'New Projects — Raison' });
});

router.get('/projects/:id', function (req, res, next) {
    res.render('dashboard/projects-edit', { title: 'Edit — Lorem Ipsum Innovation Project — Raison' });
});

router.get('/security', function (req, res, next) {
    res.render('dashboard/security', { title: 'Security — Raison' });
});

module.exports = router;
