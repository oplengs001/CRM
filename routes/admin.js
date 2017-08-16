"use strict";
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var request = require('request');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Bcrypt = require('bcryptjs');
var multer  = require('multer');
var cloudinary = require('cloudinary');
var fs = require('fs');

var storage = multer.diskStorage({
	destination : function(req,file,cb){
		cb(null, 'uploads/')
	},
	filename : function(req,file,cb){
		cb(null, Date.now() + '-' + file.originalname);
	}
});

cloudinary.config({ 
  cloud_name: 'mamoyko', 
  api_key: '552249867359262', 
  api_secret: '3jo9atwa3FUouPwsUMdluPb4Su0' 
});


var upload = multer({storage : storage});

var now = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

var Account = require('../model/admin');
var Campaigns = require('../model/campaigns');
var Oppurtunity = require('../model/oppurtunity');
var Recurring = require('../model/recurring');
var Execute = require('../model/execute');
var Team = require('../model/team');
var User = require('../model/user');
var Tasks = require('../model/tasks');
var Activity = require('../model/activity');
var Milestone = require('../model/milestone');
var LogCall = require('../model/logacall');
var PMTModel = require('../model/projectmilestonetasks');
var pmtpostModel = require('../model/pmtpost');
var PMTlogacall = require('../model/PMTlogacall');
var RateTaskModel = require('../model/feedtask');

//get admin
router.get('/', ensureAuthenticated, userPermissionAccess, function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var page_title = 'Admin | Dashboard';
	var logo = "../assets/layouts/layout/img/logo.png";
	Tasks.find({})
	.populate('team','team_name')
	.populate('account', 'account_name')
	.populate('assigned')
	.populate('created_by','fullname')
	.exec(function(err,results){
		console.log(results);
		res.render('admin',  
			{
				results : results,
				userid : user_id, 
				userName : user_name, 
				userImgPath : path, 
				page_title : page_title,
				logo : logo,
				active : {
					home : true
				}
			}
		);
	});
});


//register user

router.post('/accounts/add_user', function(req, res){

	var obj = {};

	var fullname = req.body.full_name;
	var email = req.body.email;
	var account = req.body.account;
	var position = req.body.position;
	var team = req.body.team;
	var member = req.body.member;
	var username = req.body.username;
	var password = req.body.password;

	var errors = req.validationErrors();

	if (errors) {
		res.render('register',{errors:errors});
	} else {
		var newUser = new User({
			fullname : fullname,
			email    : email,
			username : username,
			password : password,
			account : account,
			team : team,
			member : member,
			position : position,
			role : "employee"
		});

		User.createUser(newUser, function(err,user){
			if (err) throw err;
			console.log(user);
		});

		req.flash('success_msg', "you are registered and can now login");

		//res.redirect('/users/login');
		console.log('success');
	}

});



// update account
router.put('/accounts/update_user_password', function(req,res){

	var obj = {};
	var password = req.body.password;
	var user_id = req.body.user_id;
	var formCurrePass = req.body.current_password;
		
		Bcrypt.genSalt(10, function(err, salt) {
		        if(err) {
		                return console.error(err);
		        }

		        Bcrypt.hash(password, salt, function(err, hash) {
		             if(err){
		                return console.error(err);
		              }
		                console.log(hash);


		                User.findByIdAndUpdate({
		                	_id:user_id
		                },
		                	{ 
		                		$set: 
		                			{ 
		                				password : hash
		                			 },

		                	},
		                	{ upsert: true },
		                	function(err, newUser){
		                		if (err) {
		                			console.log("errors tanga");
		                		} else {
		                			console.log(newUser);
		                			res.end('Password Changed')
		                			//res.status(204);
		                		}
		                });

		        });

		});
});

//upload avatar

router.post('/accounts/api/photo', upload.any('avatar'), function (req, res, next) {

	 var user_id = req.body.id_user;
	 var path = req.files[0].path;
	 var filename = req.files[0].filename;
	 console.log(path);
	 cloudinary.uploader.upload(path, function(result) { 
	   console.log(result.url);
	   User.findByIdAndUpdate({
	   	_id:user_id
	   },
	   	{ 
	   		$set: 
	   			{ 
	   				path : result.url,
	   				has_avatar : 1
	   			 },

	   	},
	   	{ upsert: false },
	   	function(err, newUser){
	   		if (err) {
	   			console.log("errors tanga");
	   		} else {
	   			console.log(newUser);
	   		}
	   });
	 });
	  res.end("File is uploaded");
});

router.post('/users/add_user', userExist, fullnameExist, emailExist, function(req, res){

	var obj = {};
	
	var fullname = req.body.fullname;
	var email = req.body.email;
	var position = req.body.position;
	var address = req.body.address;
	var city = req.body.city;
	var country = req.body.country;

	//account details
	var role = req.body.role;
	var username = req.body.username;
	var password = req.body.password;
	var account = req.body.account;
	var team = req.body.team;

	console.log(team);
	console.log(account);

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
			role 	 : role,
			username : username,
			password : password,
			team 	 : team,
			account  : account
		});

		User.createUser(newUser, function(err,user){
			if (err) throw err;
			console.log(user);
			res.end('Added a User')
		});

		req.flash('success_msg', "you are registered and can now login");

		//res.redirect('/users/login');
	}

});

//add activity in account
router.post('/add_activity', function(req,res){

	var obj = {};

	var activity_title = req.body.activity_title;
	var activity_description = req.body.activity_description;
	var due_date = req.body.due_date;
	var status = req.body.status;
	var created_by = req.body.created_by;
	var account = req.body.account;

	var errors = req.validationErrors();


	if (errors) {
		console.log('errors');
	} else {

		var newActivity = new Activity({
			activity_title : activity_title,
			activity_description : activity_description,
			due_date : due_date,
			status : status,
			created_by : created_by,
			account : account
		});

		Activity.createActivity(newActivity, function(err,activity){
			if (err) {
				res.json(err);
			} else {
				res.json(activity);
			}
		});
		res.json('success');
	}
});

router.post('/add_logcall', function(req,res){

	var obj = {};

	var subject = req.body.subject;
	var comments = req.body.comments;
	var account = req.body.account;
	var created_by = req.user._id;
	var assigned = req.body.assigned;
	var errors = req.validationErrors();

	if (errors) {
		console.log('errors');
	} else {
		var newLogCall = new LogCall({

			subject : subject,
			comments : comments,
			account : account,
			created_by : created_by,
			assigned : assigned
		});

		LogCall.createLogCall(newLogCall, function(err,logacall){
			if (err) {
				console.log('err');
			} else {
				console.log('success');
			}
		});

		res.json('success');
	}
});

router.post('/add_pmt', function(req,res){
	var obj = {};

	var subject = req.body.subject;
	var due_date = req.body.due_date;
	var comments = req.body.comments;
	var account = req.body.account;
	var priority = req.body.priority;
	var status = req.body.status;
	var assigned = req.body.assigned;
	var project = req.body.project;
	var milestone = req.body.milestone;
	var created_by = req.body.created_by;
	var kick_off = req.body.kick_off;

	var errors = req.validationErrors();

	console.log(req.body);

	if (errors) {
		console.log('errors');
	} else {
		var newPMT = new PMTModel({

			subject : subject,
			kick_off : kick_off,
			due_date : due_date,
			comments : comments,
			account : account,
			priority : priority,
			status : status,
			assigned : assigned,
			project : project,
			milestone : milestone,
			created_by : created_by
			
		});

		PMTModel.createPMT(newPMT, function(err,PMT){
			if (err) {
				console.log('err');
			} else {
				console.log('success');
			}
		});

		res.json('success');
	}

});


router.put('/edit_pmt', function(req,res){

	var obj = {};
	var account = req.body.account;
	var assigned = req.body.assigned;
	var comments = req.body.comments;
	var due_date = req.body.due_date;
	var kick_off = req.body.kick_off;
	var milestone = req.body.milestone;
	var pmtID = req.body.pmtID;
	var priority = req.body.priority;
	var project = req.body.project;
	var status = req.body.status;
	var subject = req.body.subject;
	var kick_off = req.body.kick_off;

	PMTModel.findByIdAndUpdate({
   		_id:pmtID
   	},
   	{ 
   		$set: 
   			{ 
   				account : account,
   				assigned : assigned,
   				comments : comments,
   				due_date : due_date,
   				kick_off : kick_off,
   				due_date : due_date,
   				milestone : milestone,
   				priority : priority,
   				project : project,
   				status : status,
   				subject : subject
   			 },

   	},
   	{ upsert: false, new : true},
   	function(err, newPMT){
   		if (err) return err;
   		res.send(newPMT);
   });
});

router.put('/edit_milestone',function(req,res){
	var obj = {};

	var milestone_name = req.body.milestone_name;
	var due_date = req.body.due_date;
	var milestondec = req.body.milestondec;
	var milestone_id = req.body.milestone_id;
	var kick_start = req.body.kick_start;
	var MilestoneCompleted = req.body.MilestoneCompleted;
	
	Milestone.findByIdAndUpdate({
   	_id:milestone_id
   },
   	{ 
   		$set: 
   			{ 
   				milestone_name : milestone_name,
   				due_date : due_date,
   				kick_start: kick_start,
   				milestondec : milestondec,
   				MilestoneCompleted : MilestoneCompleted
   			 },

   	},
   	{ upsert: false },
   	function(err, newMilestone){
   		if (err) {
   			console.log("errors tanga");
   		} else {
   			res.end("success");
   			//res.status(204);
   		}
   });
});


router.post('/add_pmtpost', function(req,res){
	var obj = {};

	var post = req.body.post;
	var created_by = req.body.created_by;
	var milestone = req.body.milestone;
	var pmt = req.body.pmt;
	var errors = req.validationErrors();

	if (errors) {
		console.log('errors');
	} else {
		var newPMTPost = new pmtpostModel({

			post : post,
			created_by : created_by,
			milestone : milestone,
			pmt : pmt
			
		});

		pmtpostModel.createPMTPost(newPMTPost, function(err,PMT){
			if (err) {
				console.log('err');
			} else {
				console.log('success');
			}
		});

		res.json('success');
	}

});

router.post('/pmt_loc', function(req,res){
	var obj = {};
	var subject = req.body.subject;
	var comments = req.body.comments;
	var created_by = req.body.created_by;
	var task = req.body.task;
	var errors = req.validationErrors();
	console.log(req.body);

	if (errors) {
		console.log('errors');
	} else {
		var newPMTLogCall = new PMTlogacall({

			subject : subject,
			created_by : created_by,
			comments : comments,
			task : task
			
		});

		PMTlogacall.createPMTLogCall(newPMTLogCall, function(err,PMT){
			if (err) {
				console.log('err');
			} else {
				console.log('success');
			}
		});

		res.json('success');
	}
});

router.put('/edit_pmtlogacall',function(req,res){
	var obj = {};

	var subject = req.body.subject;
	var comments = req.body.comments;
	var priority = req.body.priority;
	var created_by = req.body.created_by;
	var kick_start = req.body.kick_start;
	var task = req.body.task;
	var pmtlog_id = req.body.pmtlog_id;

	PMTlogacall.findByIdAndUpdate({
   	_id:pmtlog_id
   },
   	{ 
   		$set: 
   			{ 
   				subject : subject,
   				comments : comments,
   				priority: priority,
   				created_by : created_by,
   				kick_start : kick_start,
   				task : task
   			 },

   	},
   	{ upsert: false },
   	function(err, newPMTLogCall){
   		if (err) {
   			console.log("errors tanga");
   		} else {
   			res.send("success");
   			//res.status(204);
   		}
   });
});

//add rate for task
router.put('/give_rate', function(req,res){
		var obj = {};
		var rate = req.body.rate;
		var task_id = req.body.task;

		PMTModel.findByIdAndUpdate({
	   	_id:task_id
	   },
	   	{ 
	   		$set: 
	   			{ 
	   				rate : rate
	   			 },

	   	},
	   	{ upsert: false },
	   	function(err, PMT){
	   		if (err) {
	   			console.log("errors tanga");
	   		} else {
	   			res.end("success");
	   			//res.status(204);
	   		}
	   });
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