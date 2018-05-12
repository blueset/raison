var express = require('express');
var router = express.Router();

var projectController = require('../controller/projectController');
var userController = require('../controller/userController');

router.get('/', async function (req, res, next) {
    res.locals.topProject = await projectController.getTopProject("Investment", 3);
    res.locals.latestProject = await projectController.getTopProject("Investment", 5, "latest");
    res.locals.investors = await  userController.getTopUser("Investors", 3);
    res.locals.startups = await userController.getTopUser("Startups", 3);
    res.render('investment/investment', { title: 'Investment — Raison' });
});


module.exports = router;
