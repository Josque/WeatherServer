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
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', name: 'Anonymous Coward' });
});

router.get('/login', function(req, res){
    res.render('login');
});

router.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res){
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
    '/users',
    function(req, res){
        User.find({}, "editUrl username", function(err, query_result){
            res.render('useradm', {users: query_result});
        });
    }
);

router.get(
    '/user/:id',
    function(req, res, next){
        User.findOne({_id: req.params.id}, function(err, query_result){
            if(query_result == null){
                next();
                return;
            }
            res.render('useredit', {user: query_result});
        })
    });

router.post('/user/:id/update', function(req, res){
   User
});

module.exports = router;
