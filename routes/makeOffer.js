var express = require('express');
var router = express.Router();

var userController = require('../controller/userController');
var projectController = require('../controller/projectController');
var offerController = require('../controller/projectOfferController');
var mongoose = require('mongoose');

router.get('/', function (req, res, next) {
    res.locals.projectId = req.query['projectId'];
    res.locals.type = req.query['type'];
    res.locals.title = req.query['title'];

    res.render('project-offer/project-offer');
});


router.post('/', function(req, res, next) {
    var projectId = req.query['projectId'];

    var typeRequired = req.query['type'] === 'Investment' ? 'Investors' : 'Donators';

    if (!req.user || req.user.role !== typeRequired) {
        res.redirect('/', {message: 'You do not have rights to make an offer!'});
    } else {
        projectController.getProject(mongoose.Types.ObjectId(projectId), function(project) {
            if (!project) {
                res.redirect('/');
            } else {
                offerController.createOffer(req, project, req.user._id, req.query['type'], function(successful) {
                    if (successful) {
                        var newlink = '/interaction/'+project._id
                        res.redirect(newlink);
                    } else {
                        res.redirect('/interaction/'+project._id, {message: "There is an error! You cannot make an offer"});
                    }
                });
            }
        });
    }
});


module.exports = router;