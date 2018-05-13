var express = require('express');
var router = express.Router();

var projectController = require('../databaseController/projectController');
var userController = require('../databaseController/userController');

router.get('/', async function (req, res, next) {
    res.locals.topProject = await projectController.getTopProject("Investment", 3,  "top");
    res.locals.latestProject = await projectController.getTopProject("Investment", 5, "latest");
    res.locals.investors = await  userController.getTopUser("Investors", 3);
    res.locals.startups = await userController.getTopUser("Startups", 3);
    res.render('investment/investment', { title: 'Investment — Raison' });
});


module.exports = router;
