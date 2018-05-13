var express = require('express');
var router = express.Router();

var userController = require('../databaseController/userController');
var projectController = require('../databaseController/projectController');
var offerController = require('../databaseController/projectOfferController');
var mongoose = require('mongoose');



router.post('/', function(req, res, next) {
    var projectId = req.body['projectId'];
    var offerId = req.body['offerId'];
    projectController.chooseOffer(req.user, mongoose.Types.ObjectId(projectId), offerId, function(message){
        res.send(message);
    });
});

module.exports = router;