var gravatar = require('gravatar');

function authenticateUser(req, res, next) {
    res.locals.user = req.user;
    if (res.locals.user) {
        res.locals.user.image = gravatar.url(res.locals.user.authentication.email, {protocol: 'https', d: 'retro'});
        for (var i = 0; i < res.locals.user.notifications.length; i++) {
            res.locals.user.notifications[i].image =
                gravatar.url(res.locals.user.notifications[i].from.email, {protocol: 'https', d: 'retro'});
        }
    }

    next();
}

module.exports = authenticateUser;