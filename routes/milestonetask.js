"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var TimerModel = require('../model/timer');
var TaskLogModel = require('../model/tasklog');

// show tasks

router.get('/', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../assets/layouts/layout/img/logo.png";
	res.render('milestone_tasks/view_milestones_tasks',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo : logo,
			active : {
				view_milestones_tasks : true
			}
		}
	);
});


router.get('/show_tasks/:id', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../../../assets/layouts/layout/img/logo.png";
	res.render('milestone_tasks/show_pmt',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo : logo,
			active : {
				show_pmt : true
			}
		}
	);
});

// http request

router.post('/add_taskLog', function(req,res){
	var obj = {};
	var subject = req.body.subject;
	var comment = req.body.comment;
	var created_by = req.body.created_by;
	var timeIn = req.body.timeIn;
	var timeOut = req.body.timeOut;
	var tasks = req.body.tasks;
	var errors = req.validationErrors();
	if (errors) {
		console.log('error');
	} else {
		var newTaskLog = {
			subject : subject,
			comment : comment,
			created_by : created_by,
			timeIn : timeIn,
			timeOut : timeOut,
			tasks : tasks,
		};
		var newTasks = new TaskLogModel(newTaskLog);
		newTasks.save(function(err,taskslog){
			if (err) console.log(err);
			res.send(taskslog);
		})
	}
})

router.post('/add_time', function(req,res){
	var obj = {};
	var tasks = req.body.tasks;
	var dateData = Date.now();
	var timeIn = new Date(dateData);
	var errors = req.validationErrors();
	if (errors) {
		console.log("error po");
	} else {
		var newTime = new TimerModel({
			timeIn : timeIn,
			tasks : tasks
		});
		TimerModel.CreateTime(newTime,function(err,time){
			if (err) throw err;
			console.log(time);
		});
	}
	res.send('success');
});

router.put('/update_time', function(req,res){
	var obj = {};
	var tasks = req.body.tasks;
	var date = Date.now();
	var timeOut = new Date(date);

	TimerModel.findOneAndUpdate({
   	tasks:tasks
   },
   	{ 
   		$set: 
   			{ 
   				timeOut : timeOut
   			 },

   	},
   	{ upsert: false, new: true},
   	function(err, timeOut){
   		if (err) {
   			console.log("errors tanga");
   		} else {
   			res.send(timeOut);
   		}
   });
});

router.put('/update_timeIn', function(req,res){
	var obj = {};
	var tasks = req.body.tasks;
	var date = Date.now();
	var timeIn = new Date(date);

		TimerModel.findOneAndUpdate({
	   	tasks:tasks
	   },
	   	{ 
	   		$set: 
	   			{ 
	   				timeIn : timeIn
	   			 },

	   	},
	   	{ upsert: false, new: true},
	   	function(err, timeIn){
	   		if (err) {
	   			console.log("errors tanga");
	   		} else {
	   			res.send(timeIn);
	   		}
	   });
});

router.put('/update_total_time', function(req,res){
	var obj = {};
	var tasks = req.body.tasks;
	var total_time = req.body.total_time;
	TimerModel.findOneAndUpdate({ tasks : tasks},{$set : { total_time : total_time },},{ upsert: false },
		function(err,totalTime){
			if (err) return err;
			res.send(totalTime);
		});
});
	


//api request

router.get('/api/get_time', function(req,res){
	TimerModel.find({})
		.exec()
		.then((timeData) => {
			res.json(timeData);
		})
		.catch((err) => {
			console.log('error on getting time');
		})
});

router.get('/api/get_time/:task_id', function(req,res){
	TimerModel.findOne({tasks:req.params.task_id})
		.exec()
		.then((timeData) => {
			res.json(timeData);
		})
		.catch((err) => {
			console.log('error on getting time');
		})
});

router.get('/api/get_task_log/:task_id', function(req,res){
	TaskLogModel.find({tasks:req.params.task_id})
		.sort({date_created:-1})
		.populate('created_by').populate('tasks')
		.exec()
		.then((taksLog) => {
			res.json(taksLog);
		})
		.catch((err) => {
			console.log(err);
		})
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