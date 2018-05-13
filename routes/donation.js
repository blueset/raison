var express = require('express');
var router = express.Router();

var projectController = require('../controller/projectController');
var userController = require('../controller/userController');

router.get('/', async function (req, res, next) {
    res.locals.topProject = await projectController.getTopProject("Donation", 3, "top");
    res.locals.latestProject = await projectController.getTopProject("Donation", 5, "latest");
    res.locals.donators = await  userController.getTopUser("Donators", 3);
    res.locals.charities = await userController.getTopUser("Charities", 3);
    res.render('donation/donation', { title: 'Donation — Raison' });
});


module.exports = router;
