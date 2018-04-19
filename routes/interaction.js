var express = require('express');
var router = express.Router();

var database = require('../models/db');

router.get('/:id', function (req, res, next) {
    res.locals.interaction = database.getInteraction(req.params.id);
    res.locals.writer = database.getUser(res.locals.interaction.writer);
    res.locals.actor = database.getUser(res.locals.interaction.actor);
    res.render('interaction/interaction', { title: 'Interactions' });
});

module.exports = router;
