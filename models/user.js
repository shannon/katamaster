// The User model
 
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    authType: String,
    authIdentifier: String,
    displayName: String,
    email: String,
    joined: {type: Date, default: Date.now}
});
 
module.exports = mongoose.model('User', userSchema);