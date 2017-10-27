var express = require('express'),
	cors = require('cors'),
	app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    morgan = require('morgan'),
    formidable = require('formidable'),
	busboy = require('connect-busboy'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    http = require('http'),
	request = require('request'),
    qs = require('querystring'),
    path = require('path'),
    cons = require('consolidate'),
    _ = require('underscore');

	//main Configuration
	config = require('./config');

	//models
	User = require('./api/models/UserModel'),
	UserRefunds = require('./api/models/UserRefundsModel'),
	NewsletterUser = require('./api/models/NewsletterUserModel'),
	VtexOrders = require('./api/models/VtexOrdersModel'),


    passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;


mongoose.Promise = global.Promise;
let conn_string = config.database.db+"?authSource="+config.database.auth.auth_db;
mongoose.connect(conn_string);

app.use(bodyParser.urlencoded({ extended: true, limit:'99mb' }));
app.use(bodyParser.json({limit:'99mb'}));
app.use(expressValidator());
// use morgan to log requests to the console
app.use(morgan('dev'));
// use busboy to upload files
app.use(busboy());
require('ssl-root-cas').inject();
// view engine setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

var routes = require('./routes');
routes(app);

app.use(express.static(__dirname + '/public'));

app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('Welcome to the PatPrimo Internal Tools server started on: ' + port);
