/**
 * Created by martijn on 5/19/17.
 */
var mongoose = require('mongoose');
var uuid = require('uuid/v4');
var hash = require('password-hash-and-salt');
var uniqueValidator = require('mongoose-unique-validator');

var Permissions = [
    "Any",
    "PostWeatherData",
    "GetWeatherData",

    "SubmitSensorNode",
    "GetSensorNodeInformation",
    "GetSensorNodeList",

    "CreateUser",
    "GetUserInfo",
    "GetUserList",

    "CreateAPIKey",
    "GetAPIKeyInformation",
    "GetAPIKeyList"

];


var APIKeySchema = mongoose.Schema({
    APIKey: {
        type: String,
        default: uuid(),
        required: true,
        unique: true
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        required: true
    },
    expirationDate:{
        type: Date
    },
    permissions: {
        type: String,
        enum: Permissions
    }

});

APIKeySchema.plugin(uniqueValidator);

APIKeySchema.methods.checkAPIKey = function(apikey, callback){

};

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    dateCreated:{
        type: Date,
        default: Date.now(),
        required: true
    },
    expirationDate:{
        type: Date
    },
    isEnabled: {
        type: Boolean,
        required: true,
        default: true
    },
    permissions: {
        type: String,
        enum: Permissions
    }
});

userSchema.plugin(uniqueValidator);

userSchema.statics.createUser = function(username, password, callback){
    var newUser = new this();
    newUser.username = username;
    hash(password).hash(function(err, hash){
        if(err){
            return callback(err)
        }
        newUser.passwordHash = hash;
        return callback(null, newUser);
    });
};

userSchema.statics.checkLogin = function(username, password, callback){
    this.findOne({
        username: username
    },
    function(err, user){
        if(err){
            return callback(err);
        }
        if(!user){
            return callback("no user found!");
        }
        hash(password).verifyAgainst(user.passwordHash, function(err, verified){
           if(err){
               return callback(err);
           }
           if(!verified){
               return callback(null, false);
           }
           if(verified){
               return callback(null, user);
           }
        });
    });
};

module.exports.APIKey = mongoose.model('APIKey', APIKeySchema);
module.exports.User = mongoose.model('user', userSchema);
module.exports.Permissions = Permissions;