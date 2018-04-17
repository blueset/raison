const mongoose = require('mongoose');
mongoose.connect("mongodb://nhatp1:Chuyentin692151@ds039058.mlab.com:39058/user_db",  { useMongoClient: true });

const Schema = mongoose.Schema;

const ROLE = {
    CHARITY: 1,
    DONATOR: 2,
    INVESTOR: 3,
    STARTUP: 4
};

const user = new Schema({
    username: Schema.ObjectId,
    password: String,
    roles: [],
    firstname: String,
    lastname: String,
    city: String,
    state: String,
    zipcode: Number
});

const User = mongoose.model('User', user);

function getUserModel() {
    return User;
}

function findUserName(userName) {
    User.findOne({username: userName}, function (err, user) {
        if (err) {
            return  { found: false, user: null};
        }

        if (user) {
            return  { found: true, user: user};
        } else {
            return {found: false, user: null};
        }
    });
}

function addUser(user) {
    user.save(function(err, user) {
       if (err) return false;
       else return true;
    });
}

model.exports = {
    getUserModel: getUserModel,
    findUserName:findUserName,
    addUser: addUser
}