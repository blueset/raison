var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var userController = require('../controller/userController');
var projectController = require('../controller/projectController');
var gravatar = require('gravatar');
var getJSON = require('get-json');

router.post('/createProject', function(req, res) {
    projectController.createProject(req, function(created) {
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
    console.log('wait a little');
    console.log(comments);
    return comments;
}

router.get('/:id', function (req, res, next) {
    projectController.getProject(req.params.id, function(project) {
        if (project) {
            res.locals.interaction = project;
            if (project.location) {
                getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='
                    + project.location.lat + ','
                    + project.location.long + '?sensor=false',
                    function (error, response) {
                        console.log('wit');
                        console.log(error);
                        console.log(response);
                    })
            }

            userController.findUser2(project.author, async function(author) {
                if (author)  {
                    res.locals.author = author;
                    var promise = new Promise((resolve, reject)=> {
                        resolve(getComments(project));
                    });

                    res.locals.comments = await promise;
                    console.log(res.locals.comments);
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
    projectController.addComment(projectId, res.locals.user._id, req.body.comment, function(saved) {
        if (saved) {
            res.redirect('/interaction/' + req.params.id);
        }
    });
});

module.exports = router;
