"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UsersModel = require('../model/user');
var Account = require('../model/admin')

//show users

router.get('/', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
	UsersModel.findOne({_id:user_id}).populate('team', 'team_name').populate('account','account_name')
	  .exec(function(err,UserData){
	  	if (err) return err;
	  	res.render('profile/user_profile',  
	  		{
	  			UserData : UserData,
	  			userid : user_id, 
	  			userName : user_name, 
	  			userImgPath : path,
	  			logo : logo
	  		}
	  	);
	  });
});

router.get('/edit', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
	UsersModel.findOne({_id:user_id}).populate('team', 'team_name').populate('account','account_name')
		.exec(function(err,userData){
			if(err) return err;
			res.render('profile/user_profile_account',
				{
					userData : userData,
					userid : user_id, 
					userName : user_name, 
					userImgPath : path,
					logo : logo
				}
			);
		})
})

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

function userPermissionAccess(req,res,next) {
	if ( req.user.role == 'admin') {
		return next();
	} else {
		//console.log('Welcome ' + req.user.fullname);
		res.send(404,'youre not allowed');
	}
}

module.exports = router;