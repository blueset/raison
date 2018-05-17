var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var numeral = require('numeral');

var userController = require('../databaseController/userController');
var projectController = require('../databaseController/projectController');


const { check, body, validationResult } = require('express-validator/check');

router.get('/dashboard', function (req, res, next) {
    res.render('dashboard/dashboard', { title: 'Dashboard — Raison' });
});

router.get('/inbox', function (req, res, next) {
    res.render('dashboard/inbox', { title: 'Inbox — Raison' });
});

router.get('/inbox/new', function (req, res, next) {
    res.render('dashboard/thread-new', { title: 'New thread — Raison' });
});

router.get('/inbox/:id', function (req, res, next) {
    res.render('dashboard/thread-detail', { title: 'Queries regarding your project Lorem Ipsum — Raison' });
});

router.get('/profile', function (req, res, next) {
    res.render('dashboard/profile', { title: 'Profile — Raison' });
});

router.post('/profile', function(req, res, next) {
    res.locals.user.name = req.body.displayname;
    res.locals.user.bio = req.body.bio;

    userController.saveUser(res.locals.user, function(successful) {
        if (successful) {
            res.locals.message = "successfully updated the profile!";
            res.render('dashboard/profile', { title: 'Profile — Raison' });
        } else {
            res.locals.message = "Cannot update your profile!";
            res.render('dashboard/profile', { title: 'Profile — Raison' });
        }
    })
});

router.get('/projects', async function (req, res, next) {
    res.locals.projects = await userController.getProjects(res.locals.user);
    res.render('dashboard/projects', { title: 'Projects — Raison' });
});

router.get('/projects/new', function (req, res, next) {
    res.locals.project = null;
    res.render('dashboard/projects-edit', { title: 'New Project — Raison' });
});


router.post('/projects/new', [
    check('project-title').exists(),
    check('banner-url').exists(),
    check('body-content').exists(),
    check('project-tags').exists()
], function (req, res, next) {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length != 0)
        return res.render('dashboard/projects-edit', { title: 'New project — Raison', errors: errors, userInput: req.body });
    projectController.createProject(req, function(error, project) {
        if (error) {
            res.render('dashboard/projects-edit', {title: 'New project — Raison', message: 'Errors in saving Project: ' + error, userInput: req.body});
        } else {
            res.redirect('/dashboard/projects');
        }
    })
});

function projectAuthentication(req, res, next) {
    var found = false;
    for (var i = 0; i < req.user.projects.length; i++) {
        if (req.user.projects[i].toString() === req.params['id']) {
            found = true;
            break;
        }
    }
    if (found) next();
    else {
        res.redirect('dashboard/dashboard', {
            title: 'Dashboard — Raison',
            message: 'You do not have privilege to alter this project'
        });
    }
}

router.get('/projects/:id',projectAuthentication, function (req, res, next) {
    projectController.getProject(mongoose.Types.ObjectId(req.params['id']), function(project) {
        res.locals.project = project;
        res.render('dashboard/projects-edit', { title: `Edit — ${project.title} — Raison` });
    });
});

router.post('/projects/:id', [
    check('project-title').exists(),
    check('banner-url').exists(),
    check('body-content').exists(),
    check('project-tags').exists()
], function (req, res, next) {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length != 0)
        return res.render('dashboard/projects-edit', { title: `Edit — ${req.body.title} — Raison`, errors: errors, userInput: req.body });
    projectController.updateProject(req, mongoose.Types.ObjectId(req.params['id']),
        function(error, project) {
            res.locals.project = project;
            if (error) {
                res.render('dashboard/projects-edit', {title: `Edit — ${project.title} — Raison`,
                    message: 'There is an error in saving process: ' + error, userInput: req.body, project: project});
            } else {
                res.render('dashboard/projects-edit', {title: `Edit — ${project.title} — Raison`, project: project});
            }
        });
});

router.get('/projects/:id/offers', 
            projectAuthentication, 
            function (req, res, next) {
                res.locals.numeral = numeral;
    projectController.getOffers(mongoose.Types.ObjectId(req.params['id']), function(offers) {
        res.locals.offers = offers;
        res.locals.linkProject = req.params['id'];
        res.render('dashboard/projects-offers', { title: 'Offers page'});
    });
});

router.get('/offers-made', projectAutentication, function(req, res, next) {
    res.locals.numeral = numeral;
    if (req.user.role === 'Donators' || req.user.role === 'Investors') {
        userController.getOffers(req.user, function(offers) {
            res.locals.offers = offers;
            res.render('dashboard/offers-made', {title: 'Offers made - Raison'});
        });
    }
    else res.redirect('/dashboard/dashboard');
});

router.get('/security', function (req, res, next) {
    res.render('dashboard/security', { title: 'Security — Raison' });
});

module.exports = router;
