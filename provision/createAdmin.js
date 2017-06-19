/**
 * Created by martijn on 5/22/17.
 */
var mongoose = require('mongoose');
var User = require('../models/AuthDataModels').User;

mongoose.connect('mongodb://localhost/weatherserver');

User.findOne({
    username: "admin"
},
function(err, u){
    if(err){
        console.error(err);
    }
    else{
        if(u === null){
            User.createUser("admin", "admin", function(err, user){
                if(err){
                    console.error(err);
                }
                user.save(function(err){
                    if(err){
                        console.error(err);
                    }
                    else{
                    }
                });
                console.log(user);
            });
        }
    }
    mongoose.disconnect();
});


