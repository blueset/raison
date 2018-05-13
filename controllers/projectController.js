var mongoose = require('mongoose');

var Project = mongoose.model('project');

var getTopProject = async function(typeProject, num_top) {

    var promise = new Promise((resolve, reject)=>{
        Project.find({}, function(err, projects) {
            var tmp_projects = [];
            projects.forEach(function(project) {
                if (typeProject == null || project.categories[0] === typeProject)
                    tmp_projects.push(project);
            });
            tmp_projects.sort(function(a, b) {
                return b.comments.length - a.comments.length;
            })
            resolve(tmp_projects.slice(0, num_top));
        });
    });

    return await promise;
}


var createProject = function(req, callback) {
    var typeProject;
    if (req.user.role === 'Startups' || req.user.role === 'Investors')
        typeProject = "Investment";
    else
        typeProject = "Donation";
    var project = new Project({
        author: req.user._id,
        investor: null,
        offers: [],
        datePosted: Date.now(),
        progress: [],
        title: req.body['project-title'],
        banner: req.body['banner-url'],
        desc: req.sanitize(req.body['body-content']),
        totalFunds: 0,
        categories: [typeProject].concat(req.body['project-tags'].split(',')),
        comments: [],
        ratings: {
            sumRate: 0,
            numVoters: 0
        }
    });

    project.save(function(err) {
        if (err) {
            callback(err, project);
        } else {
            userController.addNewProject(project._id, req.user, function(err2) {
                if (err2) callback(err, project);
                else callback(err, project);
            })
        }
    });
}


var getProject = function(projectId, callback) {
    Project.findOne({ '_id': projectId}, function(err, project) {
        if (err) callback(null);
        else
            callback(project);
    });
}

var updateProject = function(projectId, featureChanges, callback) {
    getProject(projectId, function(project) {
        if (project) {
            for (var i in featureChanges) {
                project[i] = featureChanges[i];
            }
            project.save(function(err) {
                callback(err, project);
            })
        } else {
            callback("Project to be edited does not exist.", project);
        }
    });
}

var addComment = function(projectId, userId, comment, callback) {
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

var searchProjects = function(name, days, sortBy, cb) {
    const date = Date.now() - 24 * 60 * 60 * days;
    const sort = {
        "REL": {}, 
        "TIME": {datePosted: -1}, 
        "LIKE": {},
        "COMMENT": { comments: -1}
    };
    Project.find({
        $or: {
            title: {$regex: name},
            desc: {$regex: name}
        },
        datePosted: {
            $gt: date
        },
    }).exec(cb);
}

module.exports = {
    createProject: createProject,
    addComment: addComment,
    getProject: getProject,
    updateProject: updateProject,
    getTopProject: getTopProject,
    searchProjects: searchProjects
}

// Imports moved to the end to avoid dependency cycles
var userController = require('./userController');