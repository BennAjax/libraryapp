
  /**
   * Module dependencies
   */
  const createError = require('http-errors');
  const express = require('express');
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');
  const mongoose = require('mongoose');
  const compression = require('compression');
  const helmet = require('helmet');


  const indexRouter = require('./routes/index');
  const usersRouter = require('./routes/users');
  const catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

  const app = express();

  app.use(helmet());

  // initialize mongodb connection with mongoose
  const devDatabaseUrl = 'mongodb+srv://phpfun:fundevelopment22@cluster0-epdbc.azure.mongodb.net/local_library?retryWrites=true&w=majority';
  const mongoDB = process.env.MONGODB_URI || devDatabaseUrl;
  
  mongoose.Promise = global.Promise; // Not needed for mongoose v5 upwards
  mongoose.connect( mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  }).then(() => { console.log('Successfully connected to MongoDb')}) .catch(error => console.log('Could not connect to MongoDb\n' + error));

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(compression());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'production' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;
