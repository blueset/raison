var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var userController = require('../controller/userController');
var projectController = require('../controller/projectController');

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
    res.locals.user.role = req.body.role;

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
    console.log(res.locals.projects);
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
    console.log(req.body, errors);
    if (Object.keys(errors).length != 0)
        return res.render('dashboard/projects-edit', { title: 'New project — Raison', errors: errors, userInput: req.body });
    projectController.createProject(req, function(successful, project) {
        if (!successful) {
            res.render('dashboard/projects-edit', {title: 'New project — Raison', message: 'Errors in saving Project', userInput: req.body});
        } else {
            res.redirect(`/dashboard/projects/${project.id}`);
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

router.post('/projects/:id', projectAuthentication, [
    check('title').exists(),
    check('banner').exists(),
    check('desc').exists(),
    check('project-tags').exists()
], function (req, res, next) {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length != 0)
        return res.render('/projects/projects-edit', { title: `Edit — ${project.title} — Raison`, errors: errors, userInput: req.body });
    projectController.updateProject(mongoose.Types.ObjectId(req.params['id']),
    [{'title': req.body['project-title']}, {'banner': req.body['banner-url']},
        {'desc': req.body['body-content']}, {'categories': [req.body['project-tags']]}],
    function(successful, project) {
        if (successful) {
            res.render('dashboard/projects-edit', {title: `Edit — ${project.title} — Raison`});
        } else {
            res.render('dashboard/projects-edit', {title: `Edit — ${project.title} — Raison`,
                message: 'There is an error in saving process! Try again later!', userInput: req.body});
        }
    });
});



router.get('/security', function (req, res, next) {
    res.render('dashboard/security', { title: 'Security — Raison' });
});

module.exports = router;
