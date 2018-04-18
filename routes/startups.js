var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('startups/landing', { title: 'Startups — Raison' });
});

router.get('/project-name/1', function(req, res, next) {
    res.render('startups/project', { title: 'Project Name — Startups — Raison'});
});

module.exports = router;
