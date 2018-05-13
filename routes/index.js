var express = require('express');
var router = express.Router();

var preProcess = require('../controllers/app');
var projectController = require('../controllers/projectController');
var userController = require('../controllers/userController');
var gravatar = require('gravatar');

/* GET home page. */


router.get('/', preProcess, async function (req, res) {
    var topProjects = await projectController.getTopProject(null, 5);
    var project_cards = [];
    for (var i = 0; i < topProjects.length; i++) {
        var promise = new Promise((resolve, reject) => {
            userController.findUser2(topProjects[i].author, function (author) {
                resolve(author);
            });
        });
        var tmp_author = await promise;
        project_cards.push({
            image: topProjects[i].banner,
            title: topProjects[i].title,
            projectId: topProjects[i]._id,
            author: {
                name: tmp_author.name,
                image: gravatar.url(tmp_author.authentication.email, {protocol: 'https', d: 'retro'})
            }
        });
    }

    res.locals.donators = await userController.getTopUser("Donators", 8);
    res.locals.projects = project_cards;
    res.render('landing/landing', {title: 'Raison — Connecting Investors, Startups, Donators & Charities.'});
});

router.get('/search', function (req, res, next) {
    res.locals.user = req.user;
    res.render('search', {title: 'Search — Raison', projects: []});
});

router.post('/search', function (req, res, next) {
    res.locals.user = req.user;
    projectController.searchProjects(
        req.body.query,
        parseInt(req.body.time),
        req.body.sort,
        (err, projects) => {
        if (!err) {
            res.render('search', { title: 'Search — Raison', userInput: req.body, projects: projects });
        } else {
            res.render('search', { title: 'Search — Raison', userInput: req.body, projects: [] });
        }
    });
    
});

module.exports = router;
