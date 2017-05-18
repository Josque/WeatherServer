var config = require('../config.json');
var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect(config.mongooseURL);

var WeatherServerModels = require('../models/WeatherServerModels');
var WeatherMeasurement = WeatherServerModels.WeatherMeasurement;

var SensorNode = WeatherServerModels.SensorNode;

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

router.post('/sensorNode', function(req, res, next){
	var sensorNode = new SensorNode(req.body);
	sensorNode.save(function(err){
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		else{
			res.status(200).send();
		}
	})
});

module.exports = router;
