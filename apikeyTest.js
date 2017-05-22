var mongoose = require('mongoose');
var APIKey = require('./models/AuthDataModels').APIKey;

mongoose.connect('mongodb://localhost/weatherserver');

// APIKey.createAPIKey("test API key", null, function(err, key){
//    if(err){
//        mongoose.disconnect();
//        return console.error(err);
//    }
//    key.save(function(err){
//        if(err){
//            console.error(err);
//        }
//        mongoose.disconnect();
//    })
// });
var aapie = "16392216-415a-43d7-997e-057f192020ba";
APIKey.checkAPIKey(aapie, function (err, key) {
    if(err){
        console.error(err);
    }
    else{
        console.log(key);
    }
    mongoose.disconnect();
});