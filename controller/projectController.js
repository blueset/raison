var mongoose = require('mongoose');
var gravatar = require('gravatar');

var Project = mongoose.model('project');


function topProjectComparator(a, b) {
    if (a.content.totalFunds === b.content.totalFunds) {
        return b.content.comments.length - a.content.comments.length;
    } else {
        return b.content.totalFunds - a.content.totalFunds;
    }
}

function latestComparator(a, b) {
    return b.datePosted - a.datePosted;
}

var getTopProject = async function (typeProject, num_top, criteria = "top") {

    var promise = new Promise((resolve, reject) => {
        var count = 0;
        Project.find({}, function (err, projects) {
            if (projects.length === 0)
                resolve([]);
            var tmp_projects = [];
            projects.forEach(async function (project) {
                if (typeProject == null || project.categories[0] === typeProject) {
                    const promise2 = new Promise((resolve, reject)=>{
                        userController.findUser2(project.author, function(author) {
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


var chooseOffer = function(projectId, offerId) {
    getProject(projectId, function(project){
       for (var i = 0; i < project.offers.length; i++) {
           (function(i_tmp) {
               offerController.getOffer(project.offers[i_tmp], function(offer){
                    if (offer._id.toString() === offerId) {
                        offer.accepted = 1;
                        project.investor = offer.actor;
                        project.totalFunds += offer.fundOffer;
                        project.save(function(err) {
                            console.log('Project saving: ' + err);
                        });
                        userController.findUser2(project.investor, function(investor) {
                            investor.projects.unshift(projectId);
                            investor.activity.unshift({
                                content: "Your proposal is accepted",
                                link: "/interaction/" + projectId,
                                time: Date.now()
                            });
                            investor.totalFunds += offer.fundOffer;
                            investor.save(function(err) {
                                console.log('Investor saving: ' + err);
                            })
                        });

                        userController.findUser2(project.author, function(author) {
                            author.activity.unshift({
                                content: "You have accepted one proposal!",
                                link: "/interaction/" + projectId,
                                time: Date.now()
                            });
                            author.totalFunds += offer.fundOffer;
                            author.save(function(err) {
                                console.log('Author saving: ' + err);
                            })
                        });


                    } else {
                        offer.accepted = 0;
                    }
                    offer.save(function(err) {
                        console.log('Offer saving: ' + err);
                    });
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

    project.save(function (err) {
        if (err) {
            callback(false, project);
        } else {
            console.log("USER_CONTROLLER @ ADD_NEW_PROJECT", userController, userController.addNewProject);
            userController.addNewProject(project._id, req.user, function (err2) {
                if (err2) callback(false, project);
                else callback(true, project);
            })
        }
    });
}

var addOffer = function (project, offer, callback) {
    project.offers.unshift(offer._id);
    if (project.categories[0] === 'Donation') {
        project.totalFunds += offer.fundOffer;
        userController.findUser2(project.author, function(author) {
            author.totalFunds += offer.fundOffer;
            author.save(function(err) {
            });
        });

        userController.findUser2(offer.actor, function(actor) {
            actor.totalFunds += offer.fundOffer;
            actor.save(function(err) {
            });
        });
    }
    project.save(function (err) {
        if (err) callback(false);
        else callback(true);
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
            (async function(i_tmp) {
                var promise1 = new Promise((resolve, reject)=> {
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
                            fundOffer: offer.fundOffer,
                            proposal: offer.proposal,
                            dateOffered: offer.dateOffered,
                            accepted: offer.accepted,
                            offerId: offer._id
                        });
                    });
                });
                offers.push(await promise1);
                count++;
                if (count === project.offers.length) {
                    offers.sort(function(a, b) {
                       return b.dateOffered - a.dateOffered;
                    });
                    callback(offers);
                }
            }) (i);
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

var updateProject = function (projectId, featureChanges, callback) {
    getProject(projectId, function (project) {
        if (project) {
            for (var i = 0; i < featureChanges.length; i++) {
                project[featureChanges[i]['name']] = featureChanges[i]['value'];
            }
            project.save(function (err) {
                if (err) callback(false, project);
                else callback(true, project);
            })
        } else {
            callback(false, project);
        }
    });
}

var addComment = function (projectId, userId, comment, callback) {
    Project.findOne({'_id': projectId}, function (err, project) {
        if (err) callback(false);
        else {
            project.comments.unshift({
                commenter: userId,
                comment: comment,
                date: Date.now()
            });
            project.save(function (err) {
                if (err) callback(false);
                else callback(true);
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
    chooseOffer: chooseOffer
}

var userController = require('./userController');
var offerController = require('./projectOfferController');




