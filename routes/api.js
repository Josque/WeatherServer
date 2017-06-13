var config = require('../config.json');
var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect(config.mongooseURL);

var WeatherServerModels = require('../models/WeatherDataModels');
var WeatherMeasurement = WeatherServerModels.WeatherMeasurement;
var SupportedMeasurements = WeatherServerModels.SupportedMeasurements;

var SensorNode = WeatherServerModels.SensorNode;

var querySelect = "sensorNodeId measurementType value timestamp"

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

router.get('/measurement/measurementType/:measurementType', function(req, res){
	if(req.params.measurementType in SupportedMeasurements){
        WeatherMeasurement.find({
            measurementType: req.params.measurementType
        },
		querySelect,
		function(err, query_result){
        	if(err){
        		console.error(err)
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
