/**
 * Created by martijn on 5/19/17.
 */
var mongoose = require('mongoose');
var uuid = require('uuid/v4');

var APIKeySchema = mongoose.Schema({
    APIKey: {
        type: String,
        default: uuid(),
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        required: true
    },
    expirationDate:{
        type: Date
    }

});

APIKeySchema.methods.checkAPIKey = function(apikey){

};

var userSchema = mongoose.Schema({

});

userSchema.methods.checkLogin = function(username, password){

};



module.exports.APIKey = mongoose.model('APIKey', APIkeySchema);
module.exports.User = mongoose.model('user', userSchema);