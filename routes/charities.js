var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('investors/landing', { title: 'Charities — Raison' });
});

module.exports = router;
