var mongoose = require('mongoose');

var Project = mongoose.model('project');

var createProject = function(req, callback) {
    var project = new Project({
        author: mongoose.Types.ObjectId(req.body.author),
        investor: null,
        offers: [],
        datePosted: Date.now(),
        progress: [],
        title: req.body.title,
        subtitle: req.body.subtitle,
        desc: req.body.desc,
        totalFunds: 0,
        categories: [],
        comments: [],
        ratings: {
            sumRate: 0,
            numVoters: 0
        }
    });

    project.save(function(err) {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
}


var getProject = function(projectId, callback) {
    Project.findOne({ '_id': projectId}, function(err, project) {
        if (err) callback(null);
        else
            callback (project);
    });
}

var addcomment = function(projectId, userId, comment, callback) {
    Project.findOne({'_id': projectId}, function(err, project){
        if (err) callback(false);
        else {
            project.comments.unshift({
                commenter: userId,
                comment: comment,
                date: Date.now()
            });
            project.save(function(err) {
                if (err) callback(false);
                else callback(true);
            })
        }
    });
}



module.exports = {
    createProject: createProject,
    addcomment: addcomment,
    getProject: getProject


}