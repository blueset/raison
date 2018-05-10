var express = require('express');
var router = express.Router();

var preProcess = require('../controllers/app');

/* GET home page. */

router.get('/', preProcess, function (req, res) {
    res.render('landing/landing', {title: 'Raison — Connecting Investors, Startups, Donators & Charities.'});
});

router.get('/search', function (req, res, next) {
    res.locals.user = req.user;
    res.render('search', {title: 'Search — Raison'});
});

module.exports = router;
