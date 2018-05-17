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

router.post('/read-notification', function(req, res) {
   if (req.user) {
       var notificationId = req.body.noti;
       for (var i = 0; i < req.user.notifications.length; i++) {
           if (req.user.notifications[i]._id.toString() === notificationId) {
               req.user.notifications[i].read = true;
               req.user.save();
               res.send('Yay!');
               return;
           }
       }
   }
   res.send('oops');
});


module.exports = router;
