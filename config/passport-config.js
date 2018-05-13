require('dotenv').config()

const LocalStrategy = require('passport-local').Strategy;

const userAuthentication = require('../models/db').authenticate;
const findUser = require('../models/db').findUser;


const userController = require('../databaseController/userController');

const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const TelegramStrategy = require('passport-telegram-official');

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
                        return done(null, user);
                    }
                }
                done(null, false, { 
                    message: 'Incorrect combination of username/email and password.',
                });
                req.flash('userInput', {
                    username: username
                });
            });
        }
    ));



    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(userId, done) {
        userController.findUser2(userId, function(user) {
            if (user) done(null, user);
            else  done({'error': 'user is not available!'}, null);
        });
    });
}

module.exports = configPassport;