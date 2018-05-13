var express = require('express');
var router = express.Router();

var projectController = require('../databaseController/projectController');
var userController = require('../databaseController/userController');

/* GET home page. */


router.get('/', async function (req, res) {
    res.locals.donators = await userController.getTopUser("Donators", 8);
    res.locals.projects = await projectController.getTopProject(null, 5, "top");
    res.render('landing/landing', {title: 'Raison — Connecting Investors, Startups, Donators & Charities.'});
});

router.get('/search', function (req, res, next) {
    res.locals.user = req.user;
    res.render('search', {title: 'Search — Raison'});
});

module.exports = router;
