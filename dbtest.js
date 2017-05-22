var mongoose = require('mongoose');
var WeatherServerModels = require('./models/WeatherDataModels');
var WeatherMeasurement = WeatherServerModels.WeatherMeasurement;
var SensorNode = WeatherServerModels.SensorNode;
mongoose.connect('mongodb://localhost/weatherserver');


var temperatureSensorUUID = "af14c65e-f499-445e-847e-33318b074d65";
//
// var temperatureMeasurement = new WeatherMeasurement({
//     type: "temperature",
//     value: 19,
//     sensorNodeID: temperatureSensorUUID
// });
//
// temperatureMeasurement.save(function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         mongoose.disconnect();
//     }
// });

//
// var sensorNode = new SensorNode({
//     name: "TestNode",
//     measurementTypes: ["temperature"]
// });
//
// sensorNode.save(function(e){
//     if(e){
//         console.log(e);
//         mongoose.disconnect();
//     }
//     else{
//         mongoose.disconnect();
//     }
// });

WeatherMeasurement.find({}, function(err, res){
    if(err){
        console.error(err);
        mongoose.disconnect();
    }
    else{
        console.log(res);
        mongoose.disconnect();
    }
})