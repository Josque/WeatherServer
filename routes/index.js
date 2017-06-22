var express = require('express');
var router = express.Router();
var passport = require('passport');
var WeatherDataModels = require('../models/WeatherDataModels');
var WeatherMeasurement = WeatherDataModels.WeatherMeasurement;
var SensorNode = WeatherDataModels.SensorNode;
var ensureLogin = require('connect-ensure-login').ensureLoggedIn();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WeatherServer' });
});

router.get('/login', function(req, res){
   res.render('login');
});

router.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res){
        if(req.session.returnTo){
            res.redirect(req.session.returnTo);
            return;
        }
      res.redirect('/profile');
  });

router.get(
    '/logout',
    function(req, res){
      req.logout();
      res.redirect('/');
    });

router.get(
    '/profile',
    ensureLogin,
    function(req, res){
        res.render('profile', {user: req.user });
    });

router.get(
    '/userpage',
    ensureLogin,
    function(req, res){
        res.render('index', { title: "Express", name: req.user.username})
    }
);

router.get('/temperature', function(req, res){
    SensorNode.find({}, "name sensorNodeID", function (err, query_result) {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.render(
                'temperature', {nodes: query_result}
            );
        }
    })
});

router.get(
    '/temperature/:ID',
    function(req, res){
        WeatherMeasurement.find({
                sensorNodeID: req.params.ID,
                measurementType: "temperature"
            },
            null,
            {sort: {timestamp: 1}},
            function(err, query_result){
                if(err){
                    console.error(err);
                    res.status(500).send(err);
                }
                else{
                    data = {
                        labels: [],
                        datasets: [{
                            label: "Temperature",
                            fill: false,
                            data: []
                        }]
                    };
                    for(q in query_result) {
                        item = query_result[q];
                        data.labels.push(item.timestamp);
                        data.datasets[0].data.push(item.value);
                    }
                    console.log(data);

                    res.render('temperatureChart', { chartdata: JSON.stringify(data)});
                }
            })

    }
);


module.exports = router;
