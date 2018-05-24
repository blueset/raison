var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var importOnce = require('node-sass-import-once');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var expressSanitizer = require('express-sanitizer');



// Custom middleware
var authenticateUser = require('./middleware/authenticationMiddleware');
var timeAgoMiddleware = require('./middleware/timeAgoMiddleware');
var dashboardMiddleware = require('./middleware/dashboardMiddleware');
var notificationMiddleware = require('./middleware/notificationMiddleware');

// Create database
require('./models/db.js');

// Routings
var index = require('./routes/index');
var donation = require('./routes/donation');
var investment = require('./routes/investment');
var statics = require('./routes/statics');
var auth = require('./routes/auth');
var dashboard = require('./routes/dashboard');
var projects = require('./routes/projects');
var profile = require('./routes/profile');
var makeOffer = require('./routes/makeOffer');
var chooseOffer = require('./routes/chooseOffer');
var search = require('./routes/search');

// Config
var configPassport = require('./config/passport-config');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitizer());
app.use(session({
    secret: 'info30005',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Set up cookie parser
app.use(cookieParser());

// Configuration
if (process.env.NODE_ENV !== 'production')
    app.use(sassMiddleware({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        indentedSyntax: false, // true = .sass and false = .scss
        sourceMap: true,
        importer: function (url, prev, done) {
            if (url.indexOf('@material') === 0) {
                var filePath = url.split('@material')[1];
                var nodeModulePath = `./node_modules/@material/${filePath}`;
                return {file: require('path').resolve(nodeModulePath)};
            }
            this.importOnce = importOnce;
            return this.importOnce(url, prev, done);
        },
        importOnce: {
            index: false,
            css: false,
            bower: false
        }
    }));

app.use(express.static(path.join(__dirname, 'public')));

configPassport(app, passport);

statics(app);


// Set up middleware
app.use(authenticateUser);
app.use(timeAgoMiddleware);
app.use(notificationMiddleware);

// Binding routes
app.use('/', index);
app.use('/', auth);
app.use('/', search);
app.use('/investment', investment);
app.use('/donation', donation);
app.use('/profile', profile);
app.use('/projects', projects);
app.use('/make_offer', makeOffer);
app.use('/choose-offer', chooseOffer);
app.use('/dashboard', dashboardMiddleware, dashboard);

// Handle error 404
app.use(function(req, res, next) {
    res.status(404);
    res.send("File not found!");
});

module.exports = app;