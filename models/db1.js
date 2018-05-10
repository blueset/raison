// Create database
var mongoose = require('mongoose');

mongoose.connect('mongodb://nhatp1:12345abcde@ds039058.mlab.com:39058/user_db', function(err) {
    if (!err) {
        console.log('Connected to the mongo! Yay!');
    } else {
        console.log('Oops! Cannot connect to the mongo!');
    }
});

require('./user1');
require('./project');
require('./projectOffer');
