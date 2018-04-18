const LocalStrategy = require('passport-local').Strategy;

const userAuthentication = require('../models/db').authenticate;
const findUser = require('../models/db').findUser;

function configPassport(app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
            usernameField: 'inputEmail',
            passwordField: 'inputPassword',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            var res = userAuthentication(username, password);

            if (res.found) {
                if (res.match) {
                    return done(null, res.user);
                } else {
                    return done(null, false, { message: 'Incorrect password.'});
                }
            } else {
                return done(null, false, { message: 'Incorrect username.'});

            }
        }

    ));

    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');
        console.log(user);
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        var res = findUser(username);
        if (res.found) {
            console.log("Find a user");
            done(null, res.user);
        } else {
            done({'error': 'user is not available!'}, res.user);
        }
    });
}

module.exports = configPassport;