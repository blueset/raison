const TimeAgo = require('javascript-time-ago');
const timeAgoEn = require('javascript-time-ago/locale/en');
TimeAgo.locale(timeAgoEn);

function timeAgoMiddleware(req, res, next) {
    res.locals.TimeAgo = TimeAgo;
    next();
}

module.exports = timeAgoMiddleware;