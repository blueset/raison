var express = require('express');
var router = express.Router();


var userController = require('../databaseController/userController');
var gravatar = require('gravatar');

router.get('/:username', function (req, res, next) {
    userController.findUser(req.params['username'], async function(user) {
        if (user) {
            res.locals.user_profile = user;
            res.locals.profile_image = gravatar.url(user.authentication.email, {protocol: 'https', d: 'retro'});
            res.locals.projects = await userController.getProjects(user);
            res.render('profile/profile', { title: user.name +' — ' +  user.role});
        } else {
            res.redirect('/', { message: 'User not found!'});
        }
    });
});

module.exports = router;