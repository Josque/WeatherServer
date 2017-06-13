/**
 * Created by martijn on 5/22/17.
 */
var mongoose = require('mongoose');
var User = require('./models/AuthDataModels').User;

mongoose.connect('mongodb://localhost/weatherserver');

//
// User.createUser("admin", "admin", function(err, user){
//     if(err){
//         console.error(err);
//     }
//     user.save(function(err){
//         if(err){
//             console.error(err);
//         }
//         else{
//             mongoose.disconnect();
//         }
//     });
//     console.log(user);
// });

User.checkLogin("admin", "admin", function(err, user){
    if(err){
        return console.error(err);
        mongoose.disconnect();
    }
    if(user){
        console.log("login succeeded");
        console.log(user);
    }
    else{
        console.log("login failed");
    }
    mongoose.disconnect();
});