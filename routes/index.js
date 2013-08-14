var constants = require('../constants');

exports.index = function(req, res){
  res.render('index', { title: constants.APP_NAME, user: req.user });
};

exports.login = function(req, res){
  res.render('login', { user: req.user });
}

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
}

exports.profile = function(req, res){
  res.render('profile', { user: req.user });
}