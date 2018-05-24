var dashboardAuthentication = function(req, res, next) {
    if (!req.user) {
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }
    next();
}

module.exports = dashboardAuthentication;



