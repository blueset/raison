const LocalStrategy = require('passport-local').Strategy;

const userAuthentication = require('../models/db').authenticate;
const findUser = require('../models/db').findUser;

const userController = require('../controller/userController');

function configPassport(app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
            usernameField: 'inputEmail',
            passwordField: 'inputPassword',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            userController.authenticateUser(username, password, function(userExist, passwordMatch, user) {
                if (userExist) {
                    if (passwordMatch) {
                        done(null, user);
                    } else {
                        done(null, false, { message: 'Incorrect password.'});
                    }
                } else {
                    done(null, false, { message: 'Incorrect username.'});
                }
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        console.log('serializing user:... ');
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(userId, done) {
        console.log('deserializing user:... ')
        userController.findUser2(userId, function(user) {
            if (user) done(null, user);
            else  done({'error': 'user is not available!'}, null);
        });
    });
}

module.exports = configPassport;