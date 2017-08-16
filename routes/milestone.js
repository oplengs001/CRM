"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var MilestoneModel = require('../model/milestone');

// show milestone

router.get('/', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../assets/layouts/layout/img/logo.png";
	res.render('milestones/view_milestones',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo : logo,
			active : {
				view_milestones : true
			}
		}
	);
});



// show task

router.get('/task/:id', ensureAuthenticated, userPermissionAccess, function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../../../../../assets/layouts/layout/img/logo.png";
	MilestoneModel.findOne({_id:req.params.id})
		.populate('account')
		.populate('project')
		.populate('created_by')
		.exec(function(err,milestoneData){
			if(err) return err;
			res.render('milestones/show_task',  
				{
					milestoneData : milestoneData,
					userid : user_id, 
					userName : user_name, 
					userImgPath : path,
					logo : logo,
					active : {
						show_task : true
					}
				}
			);
		})
});

// add milestone

router.post('/add_milestone', function(req,res){

	var obj = {};

	var account = req.body.account;
	var due_date = req.body.due_date;
	var milestondec = req.body.milestondec;
	var milestone_name = req.body.milestone_name;
	var project = req.body.project;
	var created_by = req.user._id;
	var kick_start = req.body.kick_start;
	var MilestoneCompleted = req.body.MilestoneCompleted;

	var errors = req.validationErrors();

	if (errors) {
		console.log('errors');
	} else {
		var newMilestone = new MilestoneModel({

			account : account,
			due_date : due_date,
			milestondec : milestondec,
			milestone_name : milestone_name,
			project : project,
			created_by : created_by,
			kick_start : kick_start,
			MilestoneCompleted : MilestoneCompleted
		});

		MilestoneModel.createMilestone(newMilestone, function(err,milestone){
			if (err) {
				console.log('err');
			} else {
				console.log('success');
			}
		});

		res.json('success');
	}
});



function userPermissionAccess(req,res,next) {
	if ( req.user.role == 'admin') {
		console.log('User is admin');
		return next();
	} else {
		console.log('Your not Admin');
		res.send(404,'youre not allowed');
	}
}


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

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

module.exports = router;