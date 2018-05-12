var express = require('express');
var router = express.Router();

var preProcess = require('../controllers/app');
var projectController = require('../controller/projectController');
var userController = require('../controller/userController');
var gravatar = require('gravatar');

/* GET home page. */


router.get('/', preProcess, async function (req, res) {
    res.locals.donators = await userController.getTopUser("Donators", 8);
    res.locals.projects = await projectController.getTopProject(null, 5);
    res.render('landing/landing', {title: 'Raison — Connecting Investors, Startups, Donators & Charities.'});
});

router.get('/search', function (req, res, next) {
    res.locals.user = req.user;
    res.render('search', {title: 'Search — Raison'});
});

module.exports = router;
