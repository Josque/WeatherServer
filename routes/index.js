var express = require('express');
var router = express.Router();
var passport = require('passport');

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


module.exports = router;
