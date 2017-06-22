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
        default: uuid,
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
    enabled: {
        type: Boolean,
        required: true,
        default: true
    },
    permissions: {
        type: String,
        enum: Permissions
    },
    name: {
        type: String
    },
    description: {
        type: String
    }

});

APIKeySchema.plugin(uniqueValidator);

APIKeySchema.statics.checkAPIKey = function(apikey, callback){
    this.findOne({APIKey: apikey}, function(err, key){
        if(err){
            callback(err);
        }
        if(!key){
            callback(null, false);
        }
        if(key){
            if(key.enabled){
                callback(null, key);
            }
            else{
                callback(null, false);
            }
        }
    })
};

APIKeySchema.statics.createAPIKey = function(name, description, callback){
  key = new this();
  key.name = name;
  key.description = description;
  callback(null, key);
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
               if(user.isEnabled){
                   return callback(null, user);
               }
               else{
                   return callback(null, false);
               }
           }
        });
    });
};

userSchema.virtual('editUrl').get(function(){
    return "/admin/user/" + this._id;
});

userSchema.statics.calculatePasswordHash = function(password, callback){
    hash(password).hash(function(err, hash){
        if(err){
            return callback(err);
        }
        else{
            return callback(null, hash);
        }
    });
};

userSchema.statics.update

module.exports.APIKey = mongoose.model('APIKey', APIKeySchema);
module.exports.User = mongoose.model('user', userSchema);
module.exports.Permissions = Permissions;