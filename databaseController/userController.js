const mongoose = require('mongoose');

const gravatar = require('gravatar');

const User = mongoose.model('users');
const passwordHash = require('password-hash');

var Pusher = require('pusher');

var pusher = new Pusher({
    appId: '527576',
    key: '815d82ff9292dfa79559',
    secret: 'bc7b6143edf5236ba15e',
    cluster: 'ap1',
    encrypted: true
});



var getTopUser = async function (typeUser, num_top) {

    var promise = new Promise((resolve, reject) => {
        User.find({}, function (err, users) {
            var tmp_users = [];
            users.forEach(function (user) {
                if (typeUser == null || user.role === typeUser) {
                    user.image = gravatar.url(user.authentication.email, {protocol: 'https', d: 'retro'});
                    tmp_users.push(user);
                }

            });
            tmp_users.sort(function (a, b) {
                if (a.totalFunds === b.totalFunds) {
                    return b.projects.length - a.projects.length;
                } else {
                    return b.totalFunds - a.totalFunds;
                }
            })
            resolve(tmp_users.slice(0, num_top));
        });
    });

    return await promise;
}

var createUser = function (req, callback) {
    var user = new User({
        authentication: {
            username: req.body.username,
            email: req.body.email,
            password: passwordHash.generate(req.body.password),
        },
        name: req.body.displayname,
        bio: "",
        totalFunds: 0,
        role: req.body.role,
        offers: [],
        projects: [],
        activity: [],
        notifications: []
    });

    user.save(function (err) {
        if (!err) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

// Find the user with username / email
var findUser = function (userIdentity, callback) {
    if (userIdentity.indexOf('@') != -1) {
        User.findOne({'authentication.email': userIdentity}, function (err, user) {
            if (err) callback(null);
            else
                callback(user);
        });
    } else {
        User.findOne({'authentication.username': userIdentity}, function (err, user) {
            if (err) callback(null);
            else
                callback(user);
        });
    }
}

// Get user based on ID
var findUser2 = function (userId, callback) {
    User.findOne({'_id': userId}, function (err, user) {
        if (err) callback(null);
        else
            callback(user);
    });
}

var addNewProject = function (projectId, user, callback) {


    projectController.getProject(projectId, function (project) {
        user.projects.unshift(projectId);
        var link = `/interaction/${project.slug}-${project._id}`;
        user.activity.unshift({
            content: "You created a new project <a href=" + link + ">" + project.title + "</a>",
            time: Date.now()
        });

        user.save(function (err) {
            callback(err);
        });
    });

}

var addActivity = function (user, content) {
    user.activity.unshift({
        content: content,
        time: Date.now()
    });

    user.save(function (err) {
    });
}

var addCurrentProject = function (user, projectId, callback) {
    var found = false;
    for (var i = 0; i < user.projects.length; i++) {
        if (user.projects[i].toString() === projectId.toString()) {
            found = true;
            break;
        }
    }
    if (found) callback(false);
    user.projects.unshift(projectId);
    callback(true);
}


var authenticateUser = function (identity, password, callback) {
    if (identity.indexOf('@') != -1) {
        User.findOne({'authentication.email': identity}, function (err, user) {
            if (err) {
                callback(false, false, null);
                return;
            }
            if (passwordHash.verify(password, user.authentication.password) || password === user.authentication.password) {
                callback(true, true, user);
            } else {
                callback(true, false, null);
            }
        });
    } else {
        User.findOne({'authentication.username': identity}, function (err, user) {
            if (!user) {
                callback(false, false, null);
                return;
            }
            if (passwordHash.verify(password, user.authentication.password) || password === user.authentication.password) {
                callback(true, true, user);
            } else {
                callback(true, false, null);
            }
        });
    }
}

var saveUser = function (user, callback) {
    user.save(function (err) {
        if (!err) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

var getProjects = async function (user) {
    var projects = [];
    if (user.projects.length === 0) {
        return [];
    }
    for (var i = 0; i < user.projects.length; i++) {
        var promise = new Promise((resolve, reject) => {
            projectController.getProject(user.projects[i], function (project) {
                resolve(project);
            });
        });
        projects.push(await promise);
        if (i === user.projects.length - 1) {
            return projects;
        }
    }
}

var notifyUser = function (userId, user, content, link, projectId, sender) {
    if (user) {
        var tmp_notification = {
            content: content,
            project: projectId,
            link: link,
            from: {
                email: sender.authentication.email,
                name: sender.name
            },
            read: false,
            time: Date.now()
        };
        user.notifications.unshift(tmp_notification);

        user.save(function (err) {
            tmp_notification.image = gravatar.url(tmp_notification.from.email, {protocol: 'https', d: 'retro'});
            tmp_notification._id = user.notifications[0]._id;
            if (!err) {
                pusher.trigger('my-channel', 'my-event', {
                    "data": tmp_notification
                });
            }
        });
    } else {
        findUser2(userId, function (user) {
            var tmp_notification = {
                content: content,
                project: projectId,
                link: link,
                from: {
                    email: sender.authentication.email,
                    name: sender.name
                },
                read: false,
                time: Date.now()
            };
            user.notifications.unshift(tmp_notification);
            tmp_notification.image = gravatar.url(tmp_notification.from.email, {protocol: 'https', d: 'retro'});
            user.save(function (err) {
                tmp_notification.image = gravatar.url(tmp_notification.from.email, {protocol: 'https', d: 'retro'});
                tmp_notification._id = user.notifications[0]._id;
                if (!err) {
                    pusher.trigger('my-channel', 'my-event', {
                        "data": tmp_notification
                    });
                }
            });
        });
    }

}


var getOffers = function (user, callback) {
    if (user.offers.length === 0) {
        callback([]);
    }
    var offers = [];
    var count = 0;
    for (var i = 0; i < user.offers.length; i++) {
        (async function (i_tmp) {

                offerController.getOffer(mongoose.Types.ObjectId(user.offers[i_tmp].offer), async function (offer) {
                    var promise2 = new Promise((resolve, reject) => {
                        projectController.getProject(offer.project, function(project) {
                           resolve(project);
                        });
                    });
                    var tmp_project = await promise2;
                    offers.push({
                        fundOffer: offer.fundOffer,
                        proposal: offer.proposal,
                        dateOffered: offer.dateOffered,
                        accepted: offer.accepted,
                        offerId: offer._id,
                        type: offer.type,
                        projectTitle: tmp_project.title,
                        projectId: tmp_project._id
                    });
                    count++;
                    if (count === user.offers.length) {
                        offers.sort(function (a, b) {
                            return b.dateOffered - a.dateOffered;
                        });
                        callback(offers);
                    }
                });
        })(i);
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
    getTopUser: getTopUser,
    addActivity: addActivity,
    notifyUser: notifyUser,
    getOffers: getOffers
}

const projectController = require('./projectController');
const offerController = require('./projectOfferController');

