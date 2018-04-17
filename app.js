var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var importOnce = require('node-sass-import-once');

// Routings
var index = require('./routes/index');
var interaction  = require('./routes/interaction');
var users = require('./routes/users');
var startups = require('./routes/startups');
var statics = require('./routes/statics');
var login = require('./routes/login');
var signup = require('./routes/signup');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
  debug: true,
  importer: function (url, prev, done) {
    if (url.indexOf('@material') === 0) {
      var filePath = url.split('@material')[1];
      var nodeModulePath = `./node_modules/@material/${filePath}`;
      return { file: require('path').resolve(nodeModulePath) };
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

// Binding routes
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/signup', signup);
app.use('/interaction', interaction);
app.use('/startups', startups);

statics(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);
