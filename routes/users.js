"use strict";
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var User = require('../model/user');
var TeamMdl = require('../model/team');
var mongoose = require('mongoose');
//register;

router.get('/register', function(req,res){
	res.render('register');
});


//login
router.get('/login', function(req,res){
	res.render('login');
});

//register user

router.post('/register', userExist, fullnameExist, emailExist, function(req, res){
	var fullname = req.body.fullname;
	var email = req.body.email;
	var position = req.body.position;
	var address = req.body.address;
	var city = req.body.city;
	var country = req.body.country;
	var username = req.body.username;
	var password = req.body.password;

	//Validation
	req.checkBody('fullname', 'Name is Require').notEmpty();
	req.checkBody('email', 'Email is Require').notEmpty();
	req.checkBody('email', 'Email is Require').isEmail();
	req.checkBody('position', 'Position is Require').notEmpty();
	req.checkBody('address', 'Address is Require').notEmpty();
	req.checkBody('city', 'City is Require').notEmpty();
	req.checkBody('username', 'Username is Require').notEmpty();
	req.checkBody('password', 'Password is Require').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('register',{errors:errors});
	} else {
		var newUser = new User({
			fullname : fullname,
			email    : email,
			position : position,
			address  : address,
			city     : city,
			country  : country,
			username : username,
			password : password
		});

		User.createUser(newUser, function(err,user){
			if (err) throw err;
			console.log(user);
		});

		req.flash('success_msg', "you are registered and can now login");

		res.redirect('/users/login');
	}

});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user){
			if (err) throw err;
			if (!user) {
				return done(null, false, {message:'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					return done(null, false, {message: 'Invalid password'});
				}
			});
		});
	}));

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id,done){
	User.getUserById(id,function(err, user){
		done(err,user);
	});
});

router.post('/login',
		passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: true}),
  		function(req, res) {
  			if ( req.user.role == 'admin') {
  				res.send(req.user.role);
  				//console.log('admin');
  			} else {
  				res.send(req.user.role);
  				//console.log('not admin');
  			}
 		}
 );

router.post('/sample', function(req,res){
	console.log('sample');
});

router.get('/logout',function(req,res){
	req.logout();
	//req.flash('success_msg', 'YOur are Logged Out');
	res.redirect('/users/login');
});

function userExist(req, res, next) {
    User.count({
        username: req.body.username,
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
           req.flash('error_msg', "User Exist");
            res.redirect("/users/register");
        }
    });
}

function fullnameExist(req, res, next) {
    User.count({
        fullname: req.body.fullname
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "Name Already Exist"
           req.flash('error_msg', "Name Already Exist");
            res.redirect("/users/register");
        }
    });
}

function emailExist(req, res, next) {
    User.count({
        email: req.body.email
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "Email Address Already Exist"
           req.flash('error_msg', "Email Address Already Exist");
            res.redirect("/users/register");
        }
    });
}

// var needsGroup = function(group) {
//   return function(req, res, next) {
//     if (req.user.role === 'employee') {
//       console.log('this is employee');
//     }
//     else {
//     	console.log('nope');
//       // res.send(401, 'Unauthorized');
//     }
//   };
// }

// function UserAuthentication(req,res,next){
// 	console.log('yeah');
// 	next();
// }

module.exports = router;	