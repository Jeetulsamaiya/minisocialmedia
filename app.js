var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// passport requires the following
const expressSession = require('express-session');
const passport = require('passport');




// 
var app = express();

// passport
/**
 * Sets up the express session middleware.           
 * @param {expressSession} expressSession - the express session middleware to use.           
 * @returns None           
 */
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "jeetul"
}));
/**
 * Initialize the passport middleware.       
 * @returns None       
 */
app.use(passport.initialize());
/**
 * Passport session setup.           
 *           
 * To support persistent login sessions, Passport needs to be able to          
 * serialize users into and deserialize users out of the session. Typically,          
 * this will be as simple as storing the user ID when serializing, and finding          
 * the user by ID when deserializing.           
 *           
 * More info on serialization can be found here:          
 * https://github.com/jaredhanson/passport/blob/master/docs/serializing.md          
 *           
 * More info on deserialization can be found here:          
 * https://github.com/jaredh
 */
app.use(passport.session());
/**
 * Serialize the user object to the session.           
 * @param {User} user - the user object to serialize           
 * @returns None           
 */
passport.serializeUser(usersRouter.serializeUser());
/**
 * Deserialize the user from the session.           
 * @param {Function} done - The callback to call when done.           
 * @returns None           
 */
passport.deserializeUser(usersRouter.deserializeUser());







// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usersRouter', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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