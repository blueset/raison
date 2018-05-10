var gravatar = require('gravatar');

function authenticateUser(req, res, next) {
    res.locals.user = req.user;
    if (res.locals.user) {
        res.locals.user.image = gravatar.url(res.locals.user.authentication.email, {protocol: 'https'});
    }
    next();
}

module.exports = authenticateUser;