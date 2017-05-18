var mongoose = require('mongoose');
var uuid = require('uuid/v4');

var supportedMeasurements = ["temperature", "relativeHumidity"];

var WeatherMeasurementSchema = mongoose.Schema({
    sensorNodeID: {
            type: String,
            required:true
        },
    measurementType: {
            type: String,
            enum: supportedMeasurements,
            required: true
        },
    value: {
            type: Number,
            required: true
        },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

var SensorNodeSchema = mongoose.Schema({
    name: String,
    sensorNodeID: {
        type: String,
        default: uuid(),
        required: true
    },
    measurementTypes: {
        type: [
            {
                type: String,
                enum: supportedMeasurements
            }
        ]
    }
});

module.exports.WeatherMeasurement = mongoose.model('WeatherMeasurement', WeatherMeasurementSchema);
module.exports.SensorNode = mongoose.model('SensorNode', SensorNodeSchema);