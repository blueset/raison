var numeral = require('numeral');
function numeralMiddleware(req, res, next) {
    res.locals.numeral = numeral;
    next();
}

module.exports = numeralMiddleware;