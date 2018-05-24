var express = require('express');
var router = express.Router();

var userController = require('../databaseController/userController');
var projectController = require('../databaseController/projectController');
var offerController = require('../databaseController/projectOfferController');
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
                offerController.createOffer(req, project, req.user, req.query['type'], function(successful) {
                    if (successful) {
                        res.redirect(`/projects/${project.slug}/${project._id}`);
                    } else {
                        res.redirect('/');
                    }
                });
            }
        });
    }
});


module.exports = router;