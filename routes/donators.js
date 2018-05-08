var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('donators/landing', { title: 'Donators — Raison' });
});

router.get('/:username', function(req, res, next) {
    res.render('donators/profile', {title: "Ronald Jackson - Donator profile - Raison"});
});

module.exports = router;
