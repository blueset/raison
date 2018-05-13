var express = require('express');
var router = express.Router();

var userController = require('../controller/userController');
var projectController = require('../controller/projectController');
var offerController = require('../controller/projectOfferController');
var mongoose = require('mongoose');



router.post('/', function(req, res, next) {
    var projectId = req.body['projectId'];
    var offerId = req.body['offerId'];
    projectController.chooseOffer(req.user, mongoose.Types.ObjectId(projectId), offerId, function(message){
        res.send(message);
    });
});

module.exports = router;