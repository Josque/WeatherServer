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

var ensureLogin = require('connect-ensure-login').ensureLoggedIn();
/* GET home page. */
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
                           res.send(result);
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


module.exports = router;
