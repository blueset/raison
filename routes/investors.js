var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('investors/landing', { title: 'Investors — Raison' });
});

router.get('/wikimedia-foundation/1', function(req, res, next) {
    res.render('investors/business', { title: 'Wikimedia Foundation — Investors — Raison'});
});

module.exports = router;
