var config = require('../config.json');
var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');
var WeatherServerModels = require('../models/WeatherServerModels');

var WeatherMeasurement = WeatherServerModels.WeatherMeasurement;

mongoose.connect(config.mongooseURL);

router.post('/measurement', function(req, res, next){

	var measurement = new WeatherMeasurement(req.body);

	measurement.save(function(err){
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		else{
			res.status(200).send();
		}
	});
});

module.exports = router;
