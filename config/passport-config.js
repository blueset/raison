require('dotenv').config()

const LocalStrategy = require('passport-local').Strategy;

const userAuthentication = require('../models/db').authenticate;
const findUser = require('../models/db').findUser;

const userController = require('../controllers/userController');

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

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.BASE_URL + "/auth/facebook/callback",
        profileFields: ['id', 'name', 'displayName', 'email']
    },
        function (accessToken, refreshToken, profile, cb) {
            userController.findUserByKey('oAuth.facebook.profile.id', profile.id, (user) => {
                if (user !== null) {cb(null, user)}
                else {
                    userController.createUserOauth("fb_" + profile.username, 
                                                    profile.emails && profile.emails[0] || `${profile.username}@facebook.com`, 
                                                    profile.displayName, 
                                                    (user) => {
                        if (user !== null) {
                            user.oAuth.facebook = {
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                profile: profile
                            }
                            user.save((err) => {cb(err, user)});
                        }
                    })
                }
            });
        }
    ));

    passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.BASE_URL + "/auth/twitter/callback"
    },
        function (token, tokenSecret, profile, cb) {
            userController.findUserByKey('oAuth.twitter.profile.id', profile.id, (user) => {
                if (user !== null) { cb(null, user) }
                else {
                    userController.createUserOauth("tw_" + profile.username,
                        profile.emails && profile.emails[0] || `${profile.username}@twitter.com`,
                        profile.displayName,
                        (user) => {
                            if (user !== null) {
                                user.oAuth.twitter = {
                                    token: token,
                                    tokenSecret: tokenSecret,
                                    profile: profile
                                }
                                user.save((err) => { cb(err, user) });
                            }
                        })
                }
            });
        }
    ));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BASE_URL + "/auth/google/callback"
    },
        function (accessToken, refreshToken, profile, cb) {
            userController.findUserByKey('oAuth.google.profile.id', profile.id, (user) => {
                if (user !== null) { cb(null, user) }
                else {
                    userController.createUserOauth("gg_" + profile.id,
                        profile.emails && profile.emails[0] || `${profile.id}@gmail.com`,
                        profile.displayName,
                        (user) => {
                            if (user !== null) {
                                user.oAuth.google = {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    profile: profile
                                }
                                user.save((err) => { cb(err, user) });
                            }
                        })
                }
            });
        }
    ));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.BASE_URL + "/auth/github/callback"
    },
        function (accessToken, refreshToken, profile, cb) {
            userController.findUserByKey('oAuth.github.profile.id', profile.id, (user) => {
                if (user !== null) { cb(null, user) }
                else {
                    userController.createUserOauth("gh_" + profile.username,
                        profile.emails && profile.emails[0] || `${profile.id}@github.com`,
                        profile.displayName,
                        (user) => {
                            if (user !== null) {
                                user.oAuth.github = {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    profile: profile
                                }
                                user.save((err) => { cb(err, user) });
                            }
                        })
                }
            });
        }
    ));

    passport.use(new TelegramStrategy({
        botToken: process.env.TELEGRAM_BOT_TOKEN
    },
        function (profile, cb) {
            userController.findUserByKey('oAuth.telegram.profile.id', profile.id, (user) => {
                if (user !== null) { cb(null, user) }
                else {
                    userController.createUserOauth("tg_" + (profile.username || profile.id),
                        profile.emails && profile.emails[0] || `${profile.id}@telegram.org`,
                        profile.first_name + " " + profile.last_name,
                        (user) => {
                            if (user !== null) {
                                user.oAuth.telegram = {
                                    profile: profile
                                }
                                user.save((err) => { cb(err, user) });
                            }
                        })
                }
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