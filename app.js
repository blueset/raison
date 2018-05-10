var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var importOnce = require('node-sass-import-once');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

// Custom middleware
var authenticateUser = require('./controllers/authenticationMiddleware');

// Create database
require('./models/db1.js');

// Routings
var index = require('./routes/index');
var startups = require('./routes/startups');
var investors = require('./routes/investors');
var charities = require('./routes/charities');
var donators = require('./routes/donators');
var statics = require('./routes/statics');
var auth = require('./routes/auth');
var dashboard = require('./routes/dashboard');

// Config
var configPassport = require('./config/passport-config');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'info30005',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());


app.use(cookieParser());

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

// Config
configPassport(app, passport);


app.use(authenticateUser);

// Binding routes
app.use('/', index);
app.use('/', auth);
app.use('/startups', startups);
app.use('/investors', investors);
app.use('/charities', charities);
app.use('/donators', donators);
app.use('/dashboard', function(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    }
    next();
}, dashboard);


statics(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;