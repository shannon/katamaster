
/**
 * Module dependencies.
 */
 
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , util = require('util')
  , mongoose = require('mongoose')
  , api = require('./api');

var SERVER_ADDRESS = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || "localhost";
var SERVER_PORT = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

var DB_ADDRESS = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var DB_PORT =  process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;

//===Database Connection================================================

mongoose.connect('mongodb://' + DB_ADDRESS + ':' + DB_PORT + '/karatenotebook');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('MongoDB Connection Opened');
});

//===Authentication====================================================

var TWITTER_CONSUMER_KEY = "n3s7bW9qBV3Q1ciMoyuAEw";
var TWITTER_CONSUMER_SECRET = "B7QOZUxXsao3E4XYow6Ouu0djI5xVGq0kzX9GAg";

var FACEBOOK_APP_ID = '--we dont have one yet--';
var FACEBOOK_APP_SECRET = '--we dont have one yet--';

var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new GoogleStrategy({
    returnURL: 'http://' + SERVER_ADDRESS + ':' + SERVER_PORT + '/auth/google/callback',
    realm: 'http://' + SERVER_ADDRESS + ':' + SERVER_PORT + '/'
  },
  function(identifier, profile, done) {
    api.signIn('google', identifier , profile.displayName, profile.emails[0].value).then(function(user){
      console.log('Signed In');
      done(null, user);
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://' + SERVER_ADDRESS + ':' + SERVER_PORT + '/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    api.signIn('twitter', profile.id , profile.displayName, '').then(function(user){
      console.log('Signed In');
      done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://' + SERVER_ADDRESS + ':' + SERVER_PORT + '/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    api.signIn('facebook', profile.id , profile.displayName, '').then(function(user){
      console.log('Signed In');
      done(null, user);
    });
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

//===Web Server=========================================================================

var app = express();

// all environments
app.set('port', SERVER_PORT);
app.set('ipaddress', SERVER_ADDRESS);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//===Routes==========================================================================

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


//===Authentication Routes=============================================================

app.get('/auth/google', 
  passport.authenticate('google'));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/auth/facebook',
  passport.authenticate('facebook'));
  
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
//===Start Server=====================================================================

http.createServer(app).listen(app.get('port'), app.get('ipaddress'), function(){
  console.log('Express server listening on ' + app.get('ipaddress') + ":" + app.get('port'));
});