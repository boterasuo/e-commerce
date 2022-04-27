const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const connection = require('./utils/db');
const sassMiddleware = require('node-sass-middleware');

const hbs = require('hbs');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const expressSession = require('express-session');
let fileStore = require('session-file-store')(expressSession);
app.use(
  expressSession({
    store: new fileStore({
      path: path.join(__dirname, 'sessions'),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
// section helper for jQuery
hbs.registerHelper('section', function(name, options) {
  if(!this._sections) this._sections = {};
  // console.log('this', this);
  this._sections[name] = options.fn(this);
  return null;
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// sass middleware
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // false for scss while true for sass
  debug: true,
  outputStyle: 'compressed',
}));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 3600000
}));

app.use((req, res, next) => {
  res.locals.auth = req.session.member;
  next();
});
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
