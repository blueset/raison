var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing/landing', { title: 'Raison — Coming Soon...' });
});

module.exports = router;
