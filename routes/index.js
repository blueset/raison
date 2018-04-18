var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.user = req.user;
  res.render('landing/landing', { title: 'Raison — Connecting Investors, Startups, Donators & Charities.' });
});

router.get('/search', function (req, res, next) {
  res.render('search', { title: 'Search — Raison' });
});

module.exports = router;
