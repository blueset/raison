var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.locals.user = req.user;
    res.render('startups/landing', { title: 'Startups — Raison' });
});

module.exports = router;
