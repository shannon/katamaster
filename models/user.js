// The User  model
 
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var userSchema = new Schema({
    authType: {type: String},
    authIdentifier: {type: String},
    displayName: {type: String},
    email: {type: String},
    joined: {type: Date, default: Date.now}
});
 
module.exports = mongoose.model('User', userSchema);