var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/admin');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'secret',
	saveUninitialized:true,
	resave:true
}));

app.use(flash());

app.locals.moment=require('moment');
app.use(function(req,res,next){
	res.locals.messages = require('express-messages')(req,res);
	next();
});

app.use(expressValidator({
	errorformatter: function(param,msg,value) {
		var namespace=param.split('.')
		, root = namespace.shift()
		, formParam = root;
		
		while(namespace.length){
		formParm += '['+ namespace.shift() + ']';
		}
		return{
			param:formParm,
			msg :msg,
			value :value
		};
	}
}));

app.use('/', indexRouter);
app.use('/admin', usersRouter);

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
