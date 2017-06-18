/**
 * Created by martijn on 6/18/17.
 */
var mongoose = require('mongoose');
var User = require('../models/AuthDataModels').User;

mongoose.connect('mongodb://localhost/weatherserver');

User.findOne({username: "admin"}, function(err, query_result){
    query_result.updateOne{}
});