var gravatar = require('gravatar');

function notificationMiddleware(req, res, next) {
    if (res.locals.user) {
        for (var i = 0; i <  res.locals.user.notifications.length; i++) {
            res.locals.user.notifications[i].image =
                gravatar.url(res.locals.user.notifications[i].from.email, {protocol: 'https', d: 'retro'});
        }
    }
    next();
}


module.exports = notificationMiddleware;