var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var userController = require('../databaseController/userController');
var projectController = require('../databaseController/projectController');

var gravatar = require('gravatar');

router.post('/createProject', function(req, res) {
    projectController.createProject(req, function(created, project) {
        if (created) {
            res.send('yay!');
        } else {
            res.send('Ooops!');
        }
    })
})



async function getComments(project) {
    var comments = [];
    for (var i = 0; i < project.comments.length; i++) {
        var tmp_comment = JSON.parse(JSON.stringify(project.comments[i]));
        var promise = new Promise((resolve, reject) => {
            userController.findUser2(project.comments[i].commenter, function(commenter) {
                var commenter = {
                    'image': gravatar.url(commenter.authentication.email, {protocol: 'https', d: 'retro'}),
                    'name': commenter.name
                }
                resolve(commenter);
            });
        });
        tmp_comment['author'] = await promise;
        comments.push(tmp_comment);
    }
    return comments;
}

router.get('/:id', function (req, res, next) {
    projectController.getProject(req.params.id, function(project) {
        if (project) {
            res.locals.interaction = project;

            userController.findUser2(project.author, async function(author) {
                if (author)  {
                    res.locals.author = author;
                    var promise = new Promise((resolve, reject)=> {
                        resolve(getComments(project));
                    });
                    var investor = null;
                    if (project.investor) {
                        var promise2 = new Promise((resolve, reject) => {
                            userController.findUser2(project.investor, function(investor) {
                                resolve(investor);
                            })
                        });
                        investor = await promise2;
                    }
                    var num_invest = 0;
                    if (investor) {
                        res.locals.investorName = investor.name;
                        res.locals.investorImage = gravatar.url(investor.authentication.email, {
                            protocol: 'https',
                            d: 'retro'
                        });
                        res.locals.investorUsername = investor.authentication.username;
                    } else {
                        for (var i = 0; i < req.user.offers.length; i++) {
                            if (req.user.offers[i].project.toString() === req.params.id) {
                                num_invest++;
                            }
                        }
                    }
                    res.locals.num_invest = num_invest;
                    res.locals.comments = await promise;
                    res.render('interaction/tmp_interaction', { title: 'Interactions' });
                } else {
                    res.send('Oops');
                }
            })

        } else {
            res.send('oops');
        }
    })
});



router.post('/:id', function(req, res, next) {
    var projectId = mongoose.Types.ObjectId(req.params.id);
    projectController.addComment(projectId, res.locals.user, req.body.comment, function(saved) {
        if (saved) {
            res.redirect('/interaction/' + req.params.id);
        }
    });
});

module.exports = router;
