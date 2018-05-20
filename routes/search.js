var express = require('express');
var router = express.Router();


var userController = require('../databaseController/userController');
var projectController = require('../databaseController/projectController');


router.get('/search', function (req, res, next) {
    res.locals.results = [];
    res.locals.userinput = null;
    res.render('search', {title: 'Search — Raison', projects: []});
});

router.post('/search', async function (req, res, next) {
    res.locals.results = await projectController.getProjectQuery(req);
    res.locals.userinput = req.body;
    res.render('search', {title: 'Search result - Raison'});
});

module.exports = router;