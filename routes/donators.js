var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('donators/landing', { title: 'Donators — Raison' });
});

module.exports = router;
