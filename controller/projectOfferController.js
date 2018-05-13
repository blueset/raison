const mongoose = require('mongoose');

const Offer = mongoose.model('projectOffer');

var createOffer = function (req, project, actor, type, callback) {
    var offer = new Offer({
        actor: actor._id,
        project: project._id,
        fundOffer: req.body['moneyOffer'],
        accepted: 2,
        type: type,
        proposal: req.body['body-content'],
        dateOffered: Date.now()
    });

    offer.save(function (err) {
        if (!err) {
            var content;
            if (actor.role === 'Investors')
                content = `You make an offer of $${req.body['moneyOffer']} for project <a href=${project._id}> ${project.title} </a>.`;
            else
                content = `You make a donation of $${req.body['moneyOffer']} for project <a href=${project._id}> ${project.title} </a>.`;

            userController.addActivity(actor, content);
            var author_content = content.replace('You', actor.name);
            var link = `/dashboard/projects/${project._id}`;
            userController.notifyUser(project.author, null, author_content, link, project._id, actor);
            projectController.addOffer(project, offer, function (successful) {
                if (successful) callback(true);
                else callback(false);
            });
        }
        else callback(false);
    });
}

var getOffer = async function (offerId, callback) {
    Offer.findOne({"_id": offerId}, function (err, offer) {
        callback(offer);
    });
}

module.exports = {
    createOffer: createOffer,
    getOffer: getOffer
}

var projectController = require('./projectController');
var userController = require('./userController');