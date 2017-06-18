/**
 * Created by martijn on 5/22/17.
 */
var mongoose = require('mongoose');
var User = require('../models/AuthDataModels').User;

mongoose.connect('mongodb://localhost/weatherserver');


User.createUser("admin", "admin", function(err, user){
    if(err){
        console.error(err);
    }
    user.save(function(err){
        if(err){
            console.error(err);
        }
        else{
            mongoose.disconnect();
        }
    });
    console.log(user);
});

