var config = require('../config.json');
var express = require('express');

var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
mongoose.connect(config.mongooseURL);

var WeatherServerModels = require('../models/WeatherDataModels');
var WeatherMeasurement = WeatherServerModels.WeatherMeasurement;
var SupportedMeasurements = WeatherServerModels.SupportedMeasurements;

var SensorNode = WeatherServerModels.SensorNode;

var querySelect = "sensorNodeID measurementType value timestamp"

var ensureApiKey = passport.authenticate('headerapikey', {session: false, failureRedirect: '/api/unauthorized'});

router.get('/measurement', function(req, res){
	WeatherMeasurement.find(
		{},
        querySelect,
		function(err, query_result){
		if(err){
			console.error(err);
			res.status(500).send(err);
		}
		else{
			res.send(query_result);
		}
	})
});

router.get('/measurement/sensorNode/:sensorNodeID', function(req, res){
	WeatherMeasurement.find({
		sensorNodeID: req.params.sensorNodeID
	},
	querySelect,
	function(err, query_result){
		if(err){
			console.error(err);
			res.status(500).send(err);
		}
		else{
			res.send(query_result)
		}
	})
});

router.get('/measurement/measurementType/:measurementType', ensureApiKey, function(req, res){
	if(req.params.measurementType in SupportedMeasurements){
        WeatherMeasurement.find({
            measurementType: req.params.measurementType
        },
		querySelect,
		function(err, query_result){
        	if(err){
        		console.error(err);
				res.status(500).send(err);
			}
			else{
        		res.send(query_result);
			}

		});

    }
    else{
		res.status(400).send({
			error: "Measurement type '" + req.params.measurementType + "' not supported."
		});
	}
});

router.post('/measurement', ensureApiKey, function(req, res, next){

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

router.post('/sensorNode', ensureApiKey, function(req, res, next){
	var sensorNode = new SensorNode(req.body);
	sensorNode.save(function(err){
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		else{
			res.status(200).send();
		}
	});
});

router.get('/unauthorized', function (req, res) {
	res.status(403).send({error: "unauthorized"});
});

module.exports = router;
