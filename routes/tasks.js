"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UsersModel = require('../model/user');
var TasksModel = require('../model/tasks');


//show tasks

router.get('/', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../assets/layouts/layout/img/logo.png";
	res.render('tasks/view_task',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo: logo,
			active : {
				tasks : true
			}
		}
	);
});

//show one task

router.get('/show_tasks/:id', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../../../assets/layouts/layout/img/logo.png";
	TasksModel.findOne({_id:req.params.id}).exec(function(err,Tasks){
		if(err) return err;
		res.render('tasks/show_tasks',  
			{
				TasksModel : Tasks,
				userid : user_id, 
				userName : user_name, 
				userImgPath : path,
				logo: logo,
				active : {
					tasks : true
				}
			}
		);
	})
})


// http request

router.post('/add_task', function(req,res){

	var obj = {};
	var subject = req.body.subject;
	var created_by = req.user._id;
	var kick_off = req.body.kick_off;
	var due_date = req.body.due_date;
	var account = req.body.account;
	var campaign = req.body.campaign;
	var assigned = req.body.assigned;
	var priority = req.body.priority;
	var status = req.body.status;
	var comments = req.body.comments;

	var errors = req.validationErrors();

	if (errors) {
		console.log('errors');
	} else {
		var newTask = new TasksModel({
			subject : subject,
			created_by : created_by,
			kick_off : kick_off,
			due_date : due_date,
			account : account,
			campaign : campaign,
			assigned : assigned,
			priority : priority,
			status : status,
			comments : comments			
		});

		TasksModel.createTask(newTask, function(err,tasks){
			if (err) {
				res.end('err');
			} else {
				res.send('success');
			}
		});
		res.json('success');
	}
});

// edit task

router.put('/edit_task', function(req,res){
	var obj = {};

	var subject = req.body.subject;
	var kick_off = req.body.kick_off;
	var due_date = req.body.due_date;
	var comments = req.body.comments;
	var assigned = req.body.assigned
	var priority = req.body.priority;
	var statuts = req.body.status;
	var task_id = req.body.task_id;
	TasksModel.findByIdAndUpdate({_id:task_id},
		{
			$set:
			{
				subject : subject,
				comments : comments,
				priority : priority,
				due_date : due_date,
				kick_off : kick_off,
				assigned : assigned,
				statuts : statuts
			},
		},
		{upsert: false},
		function(err, updateTask){
			if (err) return err;
			console.log('succes');
		});
	res.send('success');
});

router.put('/update_tasks', function(req,res){
	var obj = {};
	var task_id = req.body.task_id;
	var subject = req.body.subject;
	var kick_off = req.body.kick_off;
	var due_date = req.body.due_date;
	var account = req.body.account;
	var campaign = req.body.campaign;
	var assigned = req.body.assigned;
	var priority = req.body.priority;
	var status = req.body.status;
	var comment = req.body.comment;
	TasksModel.findOneAndUpdate({
		_id : task_id
	},
		{ 
			$set: 
				{ 
					subject : subject,
					kick_off : kick_off,
					due_date : due_date,
					account : account,
					campaign : campaign,
					assigned : assigned,
					priority : priority,
					status : status,
					comment : comment
				 },

		},
		{ upsert: false },
		function(err, newUpdatedTeam){
			if (err) {
				console.log("errors tanga");
			} else {
				console.log(newUpdatedTeam);
			}
	});
	res.send('success');
})

router.delete('/delete_tasks', function(req,res){
	var obj = {};
	var task_id = req.body.task_id;
	TasksModel.findOneAndRemove({_id:task_id})
	.exec()
	.then((tasks) => {
		console.log('deleted')
	})
	.catch((err) => {
		console.log('err');
	})
	res.send('deleted');
})


router.get('/api/users/:team_id', function(req,res){
	UsersModel.find({team:req.params.team_id})
	  .exec()
	  .then((teamUser) =>{
	  	console.log(teamUser);
	  	res.json(teamUser)
	  })
	  .catch((err) =>{
	  	res.json('error occured');
	  })
});


//api request

//show all tasks

router.get('/api', function(req,res){
	TasksModel.find({})
		.populate('team','team_name')
		.populate('account', 'account_name')
		.populate('assigned')
		.populate('created_by','fullname')
		.exec()
		.then((results) =>{
			res.send(results)
		})
		.catch((err) => {
			console.log('err');
		})
});

//show one task by ID
router.get('/api/:id', function(req,res){
	TasksModel.findOne({_id:req.params.id})
		.populate('team','team_name')
		.populate('account', 'account_name')
		.populate('campaign','team_name')
		.populate('assigned','fullname')
		.populate('created_by','fullname')
		.exec(function(err,results){
			res.send(results);
		})
});

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