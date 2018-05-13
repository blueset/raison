const TimeAgo = require('javascript-time-ago');
const timeAgoEn = require('javascript-time-ago/locale/en');
TimeAgo.locale(timeAgoEn);

function timeAgoMiddleware(req, res, next) {
    res.locals.timeAgo = new TimeAgo('en_US');
    console.log(res.locals);
    next();
}

module.exports = timeAgoMiddleware;