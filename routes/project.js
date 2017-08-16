"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Project = require('../model/project');
var Milestone = require('../model/milestone');
var PMTModel = require('../model/projectmilestonetasks');
//show projects

router.get('/', ensureAuthenticated, userPermissionAccess,  function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../assets/layouts/layout/img/logo.png";
	res.render('project/view_project',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo : logo,
			active : {
				view_project : true
			}
		}
	);
});


// show 1 project

router.get('/:id', ensureAuthenticated, userPermissionAccess, function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var project_id = req.params.id;
	var logo = "../../../assets/layouts/layout/img/logo.png";
	Project.findById({_id:req.params.id})
   .populate('account')
   .populate('created')
   .exec(function(err,results){
   		if (err) return err;
   		Milestone.find({project:project_id}).exec(function(err,milestoneData){
   			if (err) return err;
   			PMTModel.find({project:project_id})
   				.sort({date_created: -1})
   				.populate('project', 'project_name')
   				.populate('account','account_name')
   				.populate('assigned', 'fullname')
   				.populate('milestone','milestone_name')
   				.populate('created_by')
   				.exec(function(err,milestoneTask){
   					if (err) return err;
   					res.render('project/show_project',  
   						{
   							milestoneTask : milestoneTask,
   							milestoneData : milestoneData,
   							results : results,
   							userid : user_id, 
   							userName : user_name, 
   							userImgPath : path,
   							logo : logo,
   							active : {
   								show_project : true
   							}
   						}
   					);
   				})
   		});
   });
});

//crud function

//add project

router.post('/add_project', function(req,res){
	var obj = {};

	var project_name = req.body.project_name;
	var status = req.body.status;
	// var predecessor_project = req.body.predecessorProject;
	var kickoff = req.body.kickoff;
	var deadline = req.body.deadline;
	var account = req.body.account;
	var created = req.body.created;
	var description = req.body.description;
	var total_hours_budget = req.body.total_hours_budget;

	var errors = req.validationErrors();
	if (errors) {
		console.log('errors');
	} else {
		var newProject = new Project({
			project_name : project_name,
			created : created,
			account : account,
			// predecessor_project : predecessor_project,
			status : status,
			description : description,
			kickoff : kickoff,
			deadline : deadline,
			total_hours_budget : total_hours_budget
		});
		Project.createProject(newProject, function(err,project){
			if (err) {
				res.json(err);
			} else {
				res.json(project);
			}
		});
		res.json('success');
	}
});

router.put('/edit_project_completed', function(req,res){
	var obj = {};
	var percent_complete = req.body.percent_complete;
	var project_id = req.body.project_id;
		Project.findByIdAndUpdate({
	   	_id:project_id
	   },
	   	{ 
	   		$set: 
	   			{ 
	   				percent_complete : percent_complete
	   			 },

	   	},
	   	{ upsert: true },
	   	function(err, newProject){
	   		if (err) {
	   			console.log("errors tanga");
	   		} else {
	   			res.send("success");
	   			//res.status(204);
	   		}
	   });
});

router.put('/update_total_hours_budget', function(req,res){
	var obj = {};
	var project_id = req.body.project_id;
	var total_hours_budget = req.body.total_hours_budget;
	var total_hours_incurred = req.body.total_hours_incurred;
	console.log(req.body);
	Project.findByIdAndUpdate({_id:project_id},
		{$set:
			{ total_hours_budget : total_hours_budget, total_hours_incurred : total_hours_incurred },
		},
		{upsert: false},
		function(err,newTotalBudget){
			if(err) return err;
			console.log(newTotalBudget);
		});
	res.send('success');
});



router.put('/edit_project', function(req,res){

	var obj = {};
	var project_name = req.body.project_name;
	var project_id = req.body.project_id;
	var created = req.body.created;
	var account = req.body.account;
	var status = req.body.status;
	var description = req.body.description;	
	var kickoff = req.body.kickoff;
	var deadline = req.body.kickoff;
	var total_hours_budget = req.body.total_hours_budget;
	
	Project.findByIdAndUpdate({
   	_id:project_id
   },
   	{ 
   		$set: 
   			{ 
   				project_name : project_name,
   				created : created,
   				account : account,
   				status : status,
   				description : description,
   				kickoff : kickoff,
   				deadline : deadline,
   				total_hours_budget : total_hours_budget
   			 },

   	},
   	{ upsert: true },
   	function(err, newProject){
   		if (err) {
   			console.log("errors tanga");
   		} else {
   			res.end("success");
   			//res.status(204);
   		}
   });
});

router.delete('/delete_project/:id', function(req,res){
	Project.findOneAndRemove({
		_id: req.params.id
	})
	.exec()
	.then((project) => {
		console.log(project);
		res.json(project);
	})
	.catch((err) => {
		res.send('error occured');
	});
});


//api request


router.get('/api/show_milestone/:id',function(req,res){
	Milestone.find({project:req.params.id})
		.exec()
		.then((milestone) => {
			console.log(milestone)
			res.json(milestone);
		})
		.catch((err) => {
			res.json('error on getting milestone');
		})
});

//show milestone task by milestone id
router.get('/api/miilestonetasks/tasks/:milestone', function(req,res){
	PMTModel.find({milestone:req.params.milestone})
		.exec()
		.then((milestoneTasks) => {
			console.log(milestoneTasks);
			res.json(milestoneTasks);
		})
		.catch((err) => {
			res.json('error in getting milestone tasks');
		})
})

router.get('/api/show_project', function(req,res){
	Project.find({})
		.populate('account')
		.populate('created')
		.exec()
		.then((project) => {
			console.log(project);
			res.json(project)
		})
		.catch((err) => {
			res.json('Error occured');
		})
});

router.get('/api/show_project_complete', function(req,res){
	Project.find({})
		.where('status').equals('Completed')
		.exec()
		.then((project) => {
			res.json(project)
		})
		.catch((err) => {
			res.json('err occured');
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