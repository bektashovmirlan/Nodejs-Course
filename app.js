var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var csrf = require('csurf');

var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var catRoutes = require('./routes/category');

var app = express();

mongoose.connect('localhost:27017/my_db');

require('./config/passport');


//view engine
app.engine('.hbs', expressHbs({defaultLayout: 'main', extname: '.hbs', usersDir: __dirname + '/views/users'}));
app.use(express.static(process.cwd() + '/public'));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

//body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator());
app.use(session({
	secret: 'mysupersecret',
 	resave: false,
  	saveUninitialized: false,
  	store: new MongoStore({ mongooseConnection: mongoose.connection }),
  	cookie: { maxAge: 180 * 60 * 100 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'client')));

app.use(function(req, res, next){
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
})

app.use('/', routes);
app.use('/', userRoutes);
app.use('/', catRoutes);

app.listen(3000, function(){
	console.log('connected');
});
