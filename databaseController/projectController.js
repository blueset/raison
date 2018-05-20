var mongoose = require('mongoose');
var gravatar = require('gravatar');
var slug = require('slug');

var Project = mongoose.model('project');


function topProjectComparator(a, b) {
    if (a.content.totalFunds === b.content.totalFunds) {
        return b.content.comments.length - a.content.comments.length;
    } else {
        return b.content.totalFunds - a.content.totalFunds;
    }
}

function latestComparator(a, b) {
    return b.content.datePosted - a.content.datePosted;
}

function commentComparator(a, b) {
    return b.content.comments.length - a.content.comments.length;
}

function fundComparator(a, b) {
    return b.content.totalFunds - a.content.totalFunds;
}

var getTopProject = async function (typeProject, num_top, criteria) {

    var promise = new Promise((resolve, reject) => {
        var count = 0;
        Project.find({}, function (err, projects) {
            if (projects.length === 0)
                resolve([]);
            var tmp_projects = [];
            projects.forEach(async function (project) {
                if (typeProject == null || project.categories[0] === typeProject) {
                    const promise2 = new Promise((resolve, reject) => {
                        userController.findUser2(project.author, function (author) {
                            resolve(author);
                        });
                    });
                    var author = await promise2;
                    tmp_projects.push({
                        content: project,
                        author: {
                            name: author.name,
                            image: gravatar.url(author.authentication.email, {protocol: 'https', d: 'retro'})
                        }
                    });
                }
                count++;
                if (count === projects.length) {
                    if (criteria === "top")
                        tmp_projects.sort(topProjectComparator);
                    else if (criteria === "latest") {
                        tmp_projects.sort(latestComparator);
                    }
                    resolve(tmp_projects.slice(0, num_top));
                }
            });
        });
    });

    return await promise;
}

function diffDate(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffD = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffD;
}

function satisfied(project, keyword, time, topic, country, typeProject) {
    var date = new Date();
    var curDay = date.getDate();
    var curMonth = date.getMonth();
    var curYear = date.getFullYear();
    var prDay = project.datePosted.getDate();
    var prMonth = project.datePosted.getMonth();
    var prYear = project.datePosted.getFullYear();
    var firstCondition = ((!keyword || (project.title.indexOf(keyword) !== -1)) &&
        (time === 'all' || (time === '0' && (curDay === prDay && curMonth === prMonth && curYear === prYear))
            || (time === '1' && diffDate(date, project.datePosted) <= 7)
            || (time === '2' && (curMonth === prMonth && curYear === prYear))
            || (time === '3' && curYear === prYear)) &&
        (country === 'all' || (project.location && project.location.trim() === country)) &&
        (typeProject === 'all' || (project.categories[0].trim() === typeProject)));
    var secondCondition = false;
    if (topic === 'all') secondCondition = true;
    else {
        for (var i = 1; i < project.categories.length; i++) {
            if (project.categories[i].trim() === topic) {
                secondCondition = true;
                break;
            }
        }
    }

    return firstCondition && secondCondition;
}

var getProjectQuery = async function (req) {
    var keyword = req.body.keyword.toLowerCase().trim();
    var time = req.body.time.trim();
    var topic = req.body.topic.trim();
    var sortOrder = req.body.sortOrder.trim();
    var country = req.body.country.trim();
    var typeProject = req.body.typeProject.trim();

    var promise = new Promise((resolve, reject) => {
        var count = 0;
        Project.find({}, function (err, projects) {
            if (projects.length === 0)
                resolve([]);
            var tmp_projects = [];
            projects.forEach(async function (project) {
                if (satisfied(project, keyword, time, topic, country, typeProject)) {
                    const promise2 = new Promise((resolve, reject) => {
                        userController.findUser2(project.author, function (author) {
                            resolve(author);
                        });
                    });
                    var author = await promise2;
                    tmp_projects.push({
                        content: project,
                        author: {
                            name: author.name,
                            image: gravatar.url(author.authentication.email, {protocol: 'https', d: 'retro'})
                        }
                    });
                }
                count++;
                if (count === projects.length) {
                    if (sortOrder === "time")
                        tmp_projects.sort(latestComparator);
                    else if (sortOrder === "comment") {
                        tmp_projects.sort(commentComparator);
                    } else {
                        tmp_projects.sort(fundComparator);
                    }
                    resolve(tmp_projects.slice());
                }
            });
        });
    });

    return await promise;
}


var chooseOffer = function (author, projectId, offerId, callback) {
    getProject(projectId, function (project) {
        var count = 0;
        for (var i = 0; i < project.offers.length; i++) {
            (function (i_tmp) {
                offerController.getOffer(project.offers[i_tmp], function (offer) {
                    userController.findUser2(offer.actor, function (investor) {
                        var link = `/projects/${project.slug}-${project._id}`;
                        var content;
                        if (offer._id.toString() === offerId) {
                            investor.projects.unshift(projectId);
                            content = `${author.name} accepted your offer for project ` + project.title;
                        } else {
                            content = `${author.name} rejected your offer for project ` + project.title;
                        }
                        var link = `/projects/${project.slug}-${project._id}`;
                        userController.notifyUser(null, investor, content, link, projectId, author);
                    });
                    if (offer._id.toString() === offerId) {
                        offer.accepted = 1;
                        project.investor = offer.actor;
                        project.totalFunds += offer.fundOffer;
                        project.save(function (err) {
                        });

                        var link = `/projects/${project.slug}-${project._id}`;
                        var content = "You accepted a proposal for a project <a href=" + link + ">" + project.title + "</a>";
                        author.activity.unshift({
                            content: content,
                            time: Date.now()
                        });
                        author.totalFunds += offer.fundOffer;
                        author.save(function (err) {
                        });

                    } else {
                        offer.accepted = 0;
                    }
                    offer.save(function (err) {
                    });
                    count++;
                    if (count === project.offers.length) {
                        callback("You have accept the offer: " + offerId);
                    }
                });
            })(i);
        }
    });
}

var createProject = function (req, callback) {
    var typeProject;
    if (req.user.role === 'Startups' || req.user.role === 'Investors')
        typeProject = "Investment";
    else
        typeProject = "Donation";
    var project = new Project({
        slug: slug(req.body['project-title']),
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
        },
        location: req.body.location || null
    });

    project.save(function (err) {
        if (err) {
            callback(err, project);
        } else {
            userController.addNewProject(project._id, req.user, function (err2) {
                if (err2) {
                    callback(err, project);
                }
                else {
                    callback(err, project);
                }
            })
        }
    });
}

function checkFinish(taskDone, taskNeed, callback, err) {
    if (err) {
        callback(false);
        return;
    }
    if (taskDone === taskNeed) {
        if (err) callback(false);
        else callback(true);
    }
}

var addOffer = function (project, offer, callback) {
    var taskNeed;
    if (project.categories[0] === 'Donation')
        taskNeed = 3;
    else
        taskNeed = 2;
    var taskDone = 0;
    project.offers.unshift(offer._id);
    if (project.categories[0] === 'Donation') {
        project.totalFunds += offer.fundOffer;
        userController.findUser2(project.author, function (author) {
            author.totalFunds += offer.fundOffer;
            author.save(function (err) {
                taskDone++;
                checkFinish(taskDone, taskNeed, callback, err);
                userController.findUser2(offer.actor, function (actor) {
                    var found = false;
                    for (var i = 0; i < actor.projects.length; i++) {
                        if (actor.projects[i].toString() === project._id.toString()) {
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        actor.projects.unshift(project._id);
                    actor.offers.push({
                        project: project._id,
                        offer: offer._id
                    });
                    actor.totalFunds += offer.fundOffer;
                    actor.save(function (err) {
                        taskDone++;
                        checkFinish(taskDone, taskNeed, callback, err);
                    });
                });
            });
        });
    } else {
        userController.findUser2(offer.actor, function (actor) {
            actor.offers.push({
                project: project._id,
                offer: offer._id
            });
            actor.save(function (err) {
                taskDone++;
                checkFinish(taskDone, taskNeed, callback, err);
            });
        });
    }
    project.save(function (err) {
        taskDone++;
        checkFinish(taskDone, taskNeed, callback, err);
    });
}

var getOffers = async function (projectId, callback) {
    Project.findOne({"_id": mongoose.Types.ObjectId(projectId)}, async function (err, project) {
        var offers = [];
        var count = 0;
        if (project.offers.length === 0) {
            callback([]);
        }
        for (var i = 0; i < project.offers.length; i++) {
            (async function (i_tmp) {
                var promise1 = new Promise((resolve, reject) => {
                    offerController.getOffer(mongoose.Types.ObjectId(project.offers[i_tmp]), async function (offer) {
                        var promise2 = new Promise((resolve2, reject) => {
                            userController.findUser2(offer.actor, function (user) {
                                resolve2(user);
                            })
                        });
                        var tmp_user = await promise2;
                        resolve({
                            funderImage: gravatar.url(tmp_user.authentication.email, {protocol: 'https', d: 'retro'}),
                            funder: tmp_user.name,
                            funderUsername: tmp_user.authentication.username,
                            fundOffer: offer.fundOffer,
                            proposal: offer.proposal,
                            dateOffered: offer.dateOffered,
                            accepted: offer.accepted,
                            offerId: offer._id,
                            type: offer.type
                        });
                    });
                });
                offers.push(await promise1);
                count++;
                if (count === project.offers.length) {
                    offers.sort(function (a, b) {
                        return b.dateOffered - a.dateOffered;
                    });
                    callback(offers);
                }
            })(i);
        }

    });
}

var getProject = function (projectId, callback) {
    Project.findOne({'_id': projectId}, function (err, project) {
        if (err) callback(null);
        else
            callback(project);
    });
}

var updateProject = function (req, projectId, callback) {
    getProject(projectId, function (project) {
        if (project) {
            project.title = req.body['project-title'];
            project.banner = req.body['banner-url'];
            project.desc = req.body['body-content'];
            project.categories = [project.categories[0]].concat(req.body['project-tags'].split(","));

            project.save(function (err) {
                if (err) callback(err, project);
                else callback(err, project);
            })
        } else {
            callback(err, project);
        }
    });
}

var addComment = function (projectId, commenter, comment, callback) {
    Project.findOne({'_id': projectId}, function (err, project) {
        if (err) callback(err);
        else {
            project.comments.unshift({
                commenter: commenter._id,
                comment: comment,
                date: Date.now()
            });
            project.save(function (err) {
                if (err) callback(err);
                else {
                    var content = `You made a comment on project <a href='/projects/${project.slug}-${projectId}'>${project.title}</a>.`;
                    userController.addActivity(commenter, content);
                    if (commenter._id.toString() !== project.author.toString()) {
                        userController.findUser2(project.author, function (author) {
                            if (author) {
                                var author_content = `${commenter.name} commented on project ${project.title}`
                                var link = `/projects/${project.slug}-${project._id}`;
                                userController.notifyUser(null, author, author_content, link, project._id, commenter);
                                callback(err);
                            } else {
                                callback(err);
                            }
                        });
                    } else callback(err);
                }
            })
        }
    });
}

module.exports = {
    createProject: createProject,
    addComment: addComment,
    getProject: getProject,
    updateProject: updateProject,
    getTopProject: getTopProject,
    addOffer: addOffer,
    getOffers: getOffers,
    chooseOffer: chooseOffer,
    getProjectQuery: getProjectQuery
}

var userController = require('./userController');
var offerController = require('./projectOfferController');




