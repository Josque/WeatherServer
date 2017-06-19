/**
 * Created by martijn on 6/13/17.
 */
var config = require('../config.json');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.ObjectId;
mongoose.connect(config.mongooseURL);

var AuthModels = require('../models/AuthDataModels');
var User = AuthModels.User;
var APIKey = AuthModels.APIKey;
var WeatherDataModels = require('../models/WeatherDataModels');
var SensorNode = WeatherDataModels.SensorNode;

var ensureLogin = require('connect-ensure-login').ensureLoggedIn();
/* GET home page. */
router.get(
    '/',
    ensureLogin,
    function (req, res) {
        res.render(
            'adminhome'
        );
    }
);

router.get(
    '/nodes',
    ensureLogin,
    function (req, res) {
        SensorNode.find({}, "name _id", function (err, query_result) {
            if(err){
                res.status(500).send(err);
            }
            else{
                res.render(
                    'nodelist', {nodes: query_result}
                );
            }
        })
    }
)

router.get(
    '/users',
    ensureLogin,
    function(req, res){
        User.find({}, "editUrl username", function(err, query_result){
            res.render('userlist', {users: query_result});
        });
    }
);

router.get(
    '/user/:id',
    ensureLogin,
    function(req, res, next){
        User.findOne({_id: req.params.id}, function(err, query_result){
            if(query_result == null){
                next();
                return;
            }
            res.render('useredit', {user: query_result});
        })
    });

router.post(
    '/user/:id/update',
    ensureLogin,
    function(req, res){
    update = {};
    console.log(req.body);
    if(req.body.password.length > 0){
        update.passwordHash = User.calculatePasswordHash(req.body.password, function(err, hash){
           if(err){
               res.status(500).send(err);
           }
           else {
               update.passwordHash = hash;
               if (req.body.enabled === "on") {
                   update.isEnabled = true;
               }
               else {
                   update.isEnabled = false;
               }
               User.findOneAndUpdate(
                   {
                       _id: req.params.id
                   },
                   {
                       $set: update

                   },
                   function(err, result){
                       if(err){
                           res.status(500).send(err);
                       }
                       else{
                           res.redirect('/admin/user/' + result._id);
                       }
                   }

               );
           }
        });

    }

});

router.post(
    '/user/:id/delete',
    ensureLogin,
    function(req, res){
        User.findOne({
            _id: req.params.id,
            username: req.body.username
        },
        function(err, query_result){
            if(err){
                res.status(500).send(err)
            }
            else{
                if(query_result === null){
                    res.render('userremove', {result: false, username_entered: req.body.username});
                }
                else{
                    User.findOneAndRemove(
                        {
                            _id: req.params.id
                        },
                        function(err, query_result){
                            if(err){
                                res.status(500).send(err);
                            }
                            else{
                                res.render('userremove', {result: true, username_entered: req.body.username});

                            }
                        }
                );
                }
            }
        });

    }
);

router.get(
    '/user/create',
    ensureLogin,
    function (req, res) {
        res.render('usercreate');
    }
);

router.post(
    '/user/create',
    ensureLogin,
    function(req, res){
        User.createUser(req.body.username, req.body.password, function(err, user){
           if(err){
               console.error(err);
               res.status(500).send(err);
           }
           else{
               user.save(function(err){
                   if(err){
                       res.status(500).send(err);
                   }
                   else{
                       res.redirect('/admin/users');
                   }
               });
           }
        });
    }
);

router.get(
    '/apikeys',
    ensureLogin,
    function(req, res){
        APIKey.find({}, function(err, query_result){
            res.render('apikeylist', {apikeys: query_result});
        });
    }
);

router.get(
    '/apikey/create',
    ensureLogin,
    function(req, res){
        res.render('apikeycreate');
    }
);

router.post(
    '/apikey/create',
    ensureLogin,
    function (req, res) {
        var apikey = new APIKey(req.body);

        apikey.save(function(err, key){
            if(err){
                res.status(400).send(err);
            }
            else{
                res.redirect('/admin/apikey/' + key._id);
                // res.send(key);
            }
        });
    }
);

router.get(
    '/apikey/:id',
    ensureLogin,
    function(req, res){
        APIKey.findOne({_id: req.params.id}, function(err, key){
            if(err){
                res.status(500).send(err);
            }
            else{
                res.render('apikeyedit', {key: key});
            }
        });
    }
);


router.post(
    '/apikey/:id',
    ensureLogin,
    function(req, res){
        var update = req.body;
        if(update.enabled === "on"){
            update.enabled = true;
        }
        else{
            update.enabled = false;
        }

        APIKey.findOneAndUpdate({
            _id: req.params.id
        },
        {
            $set: update
        },
        function(err, key){
           if(err){
               res.status(500).send(err);
           }
           else{
               res.redirect('/admin/apikeys')
           }
        });

    }
);

router.post(
    '/apikey/:id/delete',
    ensureLogin,
    function(req, res){
        APIKey.findOne({
            _id: req.params.id,
            username: req.body.username
        },
        function(err, query_result){
          if(err){
              res.status(500).send(err);
          }
          else{
              if(query_result === null){
                  res.render('apikeyremove',{result: false, name: req.body.name});
              }
              else{
                  APIKey.findOneAndRemove(
                      {
                          _id: req.params.id
                      },
                      function(err, query_result){
                          if(err){
                              res.status(500).send(err);
                          }
                          else{
                              res.render('apikeyremove', {result: true, name: req.body.name});
                          }
                      }
                  )
              }
          }
        });
    }
);


module.exports = router;
