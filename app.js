var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var api   = require('./routes/api');

var app = express();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ApiKey = require('./models/AuthDataModels').APIKey;
var User = require('./models/AuthDataModels').User;

passport.use( new LocalStrategy(
    function(username, password, callback){
        User.checkLogin(username, password, function(err, username){
          if(err){
            return callback(err);
          }
          if(!username){
            return callback(null, false);
          }
          if(username){
            return callback(null, username);
          }
        })
    }
));

passport.serializeUser(function(user, callback) {
    callback(null, user._id);
});

passport.deserializeUser(function(id, callback) {
    User.findOne({_id: id}, function (err, user) {
        if (err) { return callback(err); }
        callback(null, user);
    });
});

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: '456742fd-6825-41cc-8d50-47cd7a1089cb', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api', api);

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

module.exports = app;
