var Q = require('q');
var User = require('./models/user');
var Form = require('./models/form').Form;
var Step = require('./models/form').Step;

function newUser(type, id, name, email){
  var deferred = Q.defer();
  new User({
    authType: type,
    authIdentifier: id,
    displayName: name,
    email: email
  }).save(function(err, user){
    if(err) deferred.reject(err);
    else deferred.resolve(user);
  });
  return deferred.promise;
}

function findUser(type, id){
  var deferred = Q.defer();
  User.findOne({authType: type, authIdentifier: id}, function(err, user) {
    if(err) deferred.reject(err);
    else deferred.resolve(user);
  });
  return deferred.promise;
}


exports.signIn = function(type, id, name, email){
  var deferred = Q.defer();
  findUser(type, id).then(function(user){
    if(!user) newUser(type, id, name, email).then(deferred.resolve);
    else deferred.resolve(user);
  });
  return deferred.promise;
}

exports.addForm = function(id, name, description){
  var deferred = Q.defer();  
  new Form({
    user: id,
    name: name,
    description: description
  }).save(function(err, form){
    if(err) deferred.reject(err);
    else deferred.resolve(form);
  });
  return deferred.promise;
}


exports.route = function(req, res){
  if (!req.isAuthenticated()){}
}