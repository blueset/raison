const mongoose = require('mongoose');
const projectController = require('./projectController');
const User = mongoose.model('users');
const passwordHash = require('password-hash');

var User = mongoose.model('users');

var createUser = function(req, callback) {
    var user = new User({
        authentication: {
            username: req.body.username,
            email: req.body.email,
            password: passwordHash.generate(req.body.password),
        },
        name: req.body.displayname,
        bio: "",
        role: req.body.role,
        projects: [],
        activity: []
    });

    user.save(function(err) {
        if (!err) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

// Find the user with username / email
var findUser = function(userIdentity, callback) {
    if (userIdentity.indexOf('@') != -1) {
        User.findOne({ 'authentication.email': userIdentity}, function(err, user) {
            if (err) callback(null);
            else
                callback (user);
        });
    } else {
        User.findOne({ 'authentication.username': userIdentity}, function(err, user) {
            if (err) callback(null);
            else
                callback (user);
        });
    }
}

// Get user based on ID
var findUser2 = function(userId, callback) {
    User.findOne({'_id': userId}, function(err, user) {
        if (err) callback(null);
        else
            callback (user);
    });
}

var addNewProject = function(projectId, user, callback) {

        user.projects.unshift(projectId);
        user.activity.unshift({
            content: "You created a new project",
            link: "/interaction/" + projectId,
            time: Date.now()
        });

        user.save(function(err) {
            callback(err);
        });
}


var authenticateUser = function(identity, password, callback) {
    if (identity.indexOf('@') != -1) {
        User.findOne({ 'authentication.email': identity}, function(err, user) {
            if (err) {callback(false, false, null); return;}
            if (passwordHash.verify(password, user.authentication.password) || password === user.authentication.password) {
                callback(true, true, user);
            } else {
                callback(true, false, null);
            }
        });
    } else {
        User.findOne({ 'authentication.username': identity}, function(err, user) {
            if (!user) {callback(false, false, null); return;}
            if (passwordHash.verify(password, user.authentication.password) || password === user.authentication.password) {
                callback(true, true, user);
            } else {
                callback(true, false, null);
            }
        });
    }
}

var saveUser = function(user, callback) {
    user.save(function(err) {
        if (!err) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

var getProjects = async function(user) {

    var projects = [];
    for (var i = 0; i < user.projects.length; i++) {
        var promise = new Promise((resolve, reject) => {
            projectController.getProject(user.projects[i], function (project) {
                resolve(project);
            });
        });
        projects.push(await promise);
        if (i == user.projects.length - 1) {
            console.log(projects);
            return projects;
        }
    }
}

module.exports = {
    createUser: createUser,
    findUser: findUser,
    findUser2: findUser2,
    authenticateUser: authenticateUser,
    saveUser: saveUser,
    addNewProject: addNewProject,
    getProjects: getProjects,
}


var projectController = require('./projectController');
