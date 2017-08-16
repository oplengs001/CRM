var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PMTModel = require('../../model/projectmilestonetasks');

//get admin
router.get('/', ensureAuthenticated, function(req, res){
	res.render('employee_dashboard/home');
});

//api calls tasks

router.get('/task/users/api/',function(req,res){
	PMTModel.find({})
		.populate('assigned')
		.exec()
		.then((tasksUser) => {
			res.json(tasksUser);
		})
		.catch((err) => {
			res.json('error occured');
		})
});

//api call for assigned task

router.get('/task/users/api/:id',function(req,res){
	PMTModel.find({assigned:req.params.id})
		.populate('assigned')
		.populate('created_by')
		.populate('project')
		.populate('milestone')
		.exec()
		.then((tasksUser) => {
			res.json(tasksUser);
		})
		.catch((err) => {
			res.json('error occured');
		})
});

//find all complete task from a user

router.get('/task/completed/api/:id', function(req,res){
	PMTModel.find({assigned:req.params.id})
			.where('status').equals('5')
			.exec()
			.then((task) => {
				console.log(task);
				res.json(task);
			})
			.catch((err) => {
				res.send('error occured');
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