"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var ProjectModel = require('../model/project');
var MilestoneModel = require('../model/milestone');

//get salesview

router.get('/', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var page_title = 'Dashboard';
	var logo = "../assets/layouts/layout/img/logo.png";
	res.render('projectview',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path, 
			page_title : page_title,
			logo : logo,
			active : {
				projectview : true
			}
		}
	);
});


// api request




function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

function userPermissionAccess(req,res,next) {
	if ( req.user.role == 'admin') {
		console.log('User is Login');
		return next();
	} else {
		//console.log('Welcome ' + req.user.fullname);
		res.send(404,'youre not allowed');
	}
}

module.exports = router;