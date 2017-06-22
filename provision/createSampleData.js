/**
 * Created by martijn on 6/19/17.
 */
var mongoose = require('mongoose');
var uuid = require('uuid').v4;
var WeatherMeasurement = require('../models/WeatherDataModels').WeatherMeasurement;
var SensorNode = require('../models/WeatherDataModels').SensorNode;
mongoose.connect('mongodb://localhost/weatherserver');

var measurements = [];


var s = SensorNode({
    name: "Dummy Temperature Sensor"
});

s.save(function(err, sensor){
    sensorID = sensor.sensorNodeID;
    console.log("Created sample data with sensor ID: ");
    console.log(sensorID);
    for(i = 0; i < 15; i ++) {
        var d = new Date('2017-05-22T00:00:00.000Z');
        d.setHours(d.getHours() + i);
        var m = new WeatherMeasurement({
            sensorNodeID: sensorID,
            measurementType: "temperature",
            value: Math.floor(Math.random() * 30) + 20,
            timestamp: d
        });
        m.save(function(err, measurement){
            if(err){
                console.log(err);
            }
            measurements.push(measurement);
        });
    }

    function waitforsave(){
        if(measurements.length < 15){
            console.log('Waiting for data to save...');
            setTimeout(waitforsave, 100);
        }
        else{
            mongoose.disconnect();
        }

    }

    setTimeout(waitforsave, 100);

});





