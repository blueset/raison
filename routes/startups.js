var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('startups/landing', { title: 'Startups — Raison' });
});

module.exports = router;
