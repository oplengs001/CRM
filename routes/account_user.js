"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UsersModel = require('../model/user');
var Account = require('../model/admin');
var UserModel = require('../model/user');

//show users

router.get('/', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
	UsersModel.find({}).populate('team', 'team_name').populate('account','account_name')
			  .exec(function(err,usersData){
			  	if (err) return err;
			  	res.render('account_users/show_users',  
			  		{
			  			usersData : usersData,
			  			userid : user_id, 
			  			userName : user_name, 
			  			userImgPath : path,
			  			logo : logo,
			  			active : {
			  				show_users : true
			  			}
			  		}
			  	);
			  });
});


//get user-profile
router.get('/:id', ensureAuthenticated, userPermissionAccess, function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
		UsersModel.findOne({_id:req.params.id}).populate('team', 'team_name').populate('account','account_name')
		  .exec(function(err,UserData){
		  		res.render('account_users/user_profile',  
		  			{
		  				UserData : UserData,
		  				userid : user_id, 
		  				userName : user_name, 
		  				userImgPath : path,
		  				logo : logo,
		  				active : {
		  					user_profile : true
		  				}
		  			}
		  		);
		  });
});

//show users

router.get('/show_user/:id', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
	UsersModel.findOne({_id:req.params.id}).populate('team', 'team_name').populate('account','account_name')
	.exec(function(err,userData){
		res.render('account_users/show_user_profile',  
			{
				userData : userData,
				userid : user_id, 
				userName : user_name, 
				userImgPath : path,
				userData : userData,
				logo : logo,
				active : {
					show_user_profile : true
				}
			}
		);
	});
});

//add users

router.get('/show_users/add_new',ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
	var query = Account.findById({_id:req.params.id})
		query.exec(function(err,account){
			if (err) {
				console.log("err")
			}
			res.render('account_users/add_user',  
				{
					accountmodel : account,
					userid : user_id, 
					userName : user_name, 
					userImgPath : path,
					logo : logo,
					active : {
						add_user : true
					}
				}
			);
		});
});


// http request

//update user info
router.put('/update_user', function(req,res){

	var obj = {};
	var fullname = req.body.fullname;
	var email = req.body.email;
	var position = req.body.position;
	var address = req.body.address;
	var city = req.body.city;
	var country = req.body.country;
	var about = req.body.about;
	var dateOfBirth = req.body.dateOfBirth;
	var mobileNumber = req.body.mobileNumber;
	var user_id = req.body.user_id;
	console.log(req.body);

   UserModel.findByIdAndUpdate({
   	_id:user_id
   },
   	{ 
   		$set: 
   			{ 
   				fullname : fullname,
   				email : email,
   				position : position,
   				address : address,
   				city : city,
   				country : country,
   				about : about,
   				dateOfBirth : dateOfBirth,
   				mobileNumber : mobileNumber,
   			 },

   	},
   	{ upsert: false, new : true },
   	function(err, newUser){
   		if (err) {
   			console.log("errors tanga");
   		} else {
   			console.log(newUser);
   		}
   });
   res.send('success');
});

//update employee other info
router.put('/update_user_employee_info', function(req,res){

	var obj = {};
	var dateStarted =  req.body.dateStarted;
	var regulizationDate = req.body.regulizationDate; 
	var sssNumber = req.body.sssNumber;
	var TinNumber = req.body.TinNumber; 
	var philHealthNumber =  req.body.philHealthNumber;
	var pagibig = req.body.pagibig;
	var current_salary =  req.body.current_salary;
	var allowance = req.body.allowance; 
	var other_allowance = req.body.other_allowance;
	var employeeStatus = req.body.employeeStatus;
	var workSchedule = req.body.workSchedule; 
	var user_id = req.body.user_id;

   UserModel.findByIdAndUpdate({
   	_id:user_id
   },
   	{ 
   		$set: 
   			{ 
   				dateStarted : dateStarted,
   				regulizationDate :regulizationDate, 
   				sssNumber : sssNumber,
   				TinNumber : TinNumber, 
   				philHealthNumber : philHealthNumber,
   				pagibig : pagibig,
   				current_salary : current_salary,
   				allowance : allowance, 
   				other_allowance : other_allowance,
   				employeeStatus : employeeStatus,
   				workSchedule : workSchedule
   			 },

   	},
   	{ upsert: false, new : true },
   	function(err, updateEmployeeInfo){
   		if (err) console.log('error on updating');
   		res.send(updateEmployeeInfo);
   });
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