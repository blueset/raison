const mongoose = require('mongoose');

const Offer = mongoose.model('projectOffer');

var createOffer = function (req, project, actorId, type, callback) {
    var offer = new Offer({
        actor: actorId,
        project: project._id,
        fundOffer: req.body['moneyOffer'],
        accepted: 2,
        type: type,
        proposal: req.body['body-content'],
        dateOffered: Date.now()
    });

    offer.save(function (err) {
        if (!err) {
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