"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var AccountModel = require('../model/admin');
var TeamModel = require('../model/team');
var UsersModel = require('../model/user');
var ProjectModel = require('../model/project');
var OpportunityModel = require('../model/oppurtunity');
var ContactsModel = require('../model/contacts');
var LogEmailModel = require('../model/accountLogEmail');
var LogACallModel = require('../model/logacall');
var TasksModel = require('../model/tasks');
var PostModel = require('../model/post');

//render files

//get admin-account
router.get('/', ensureAuthenticated, userPermissionAccess, function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../assets/layouts/layout/img/logo.png";
	res.render('accounts/accounts',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo: logo,
			active : {
				account : true
			}
		}
	);
});

//get admin by id
router.get('/show_accounts/:id', ensureAuthenticated, userPermissionAccess, function(req,res){
	var user_id = req.user._id;
	var account_id = req.params.id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
	AccountModel.findById({_id:account_id}).populate('account_owner').exec(function(err,account){
			if (err) return err;
			TeamModel.find({account:account_id}).populate('account').exec(function(err,campaignData){
				if (err) return err;
				UsersModel.find({account:account_id}).populate('account').populate('team').exec(function(err,userData){
				if (err) return err;
				ProjectModel.find({account:account_id}).populate('account').populate('created').exec(function(err,projectData){
						if (err) return err;
				OpportunityModel.find({oppurtunity_account:account_id}).populate('oppurtunity_account').populate('oppurtunity_owner')
					.exec(function(err,oppurtunityData){
						if (err) return err;
							ContactsModel.find({contacts_account_name:account_id}).exec(function(err,contactData){
								if (err) return err;
								LogEmailModel.find({account:account_id}).populate('account').populate('assigned').populate('created_by').exec(function(err,accountLogemail){
									if (err) return err;
									LogACallModel.find({account:account_id}).populate('account').populate('created_by').populate('assigned').exec(function(err,accountLogCall){
										if (err) return err;
										TasksModel.find({account:account_id}).populate('created_by').populate('account').populate('assigned').exec(function(err,accountTaskLog){
											if (err) return err;
											PostModel.find({account:account_id}).populate('account').populate('user').exec(function(err,accountPost){
												if (err) return err;
												res.render('accounts/show_accounts',  
													{
														accountPost : accountPost,
														accountTaskLog : accountTaskLog,
														accountLogCall : accountLogCall,
														accountLogemail : accountLogemail,
														account_id : account_id,
														contactData : contactData,
														oppurtunityData : oppurtunityData,
														projectData : projectData,
														userData : userData,
														campaignData : campaignData,
														accountmodel : account,
														userid : user_id, 
														userName : user_name, 
														userImgPath : path,
														logo : logo,
														active : {
															account : true
														},
														helpers : {
															ProjectDeadline : function(){
																for (var key in projectData) {
																	var newMonth;
																	var date = new Date(projectData[key].deadline);
																	var month = date.getMonth() + 1;
																	switch(month){
																		case 1 : 
																			newMonth =  'January';
																			break;
																		case 2 : 
																			newMonth = 'February';
																			break;
																		case 3 : 
																			newMonth = 'March';
																			break;
																		case 4 : 
																			newMonth = 'April';
																			break;
																		case 5 : 
																			newMonth = 'May';
																			break;
																		case 6 : 
																			newMonth = 'June';
																			break;
																		case 7 : 
																			newMonth = 'July';
																			break;
																		case 8 : 
																			newMonth = 'August';
																			break;
																		case 9 : 
																			newMonth = 'September';
																			break;
																		case 10 : 
																			newMonth = 'October';
																			break;
																		case 11 : 
																			newMonth = 'November';
																			break;
																		case 12 : 
																			newMonth = 'December';
																			break;
																	}
																	return newMonth + " " + date.getDate() + " " + date.getFullYear();
																}
															},
															ProjectStatus : function(){
																for (var data in projectData) {

																	if ( projectData[data].status == 'Completed' ) {
																	    return '<span class="label label-success">'+ projectData[data].status +'</span>'
																	} else if ( projectData[data].status == 'Pending' ) {   
																	    return '<span class="label label-warning">'+ projectData[data].status +'</span>'
																	} else if ( projectData[data].status == 'Testing' ) {
																	    return '<span class="label label-info">'+ projectData[data].status +'</span>'
																	} else if ( projectData[data].status == 'Approved' ) {
																	    return '<span class="label label-primary">'+ projectData[data].status +'</span>'
																	} else if ( projectData[data].status == 'Rejected' ) {
																	    return '<span class="label label-danger">'+ projectData[data].status +'</span>'
																	}

																}
															},
															OppurCloseDate : function(){
																for (var key in oppurtunityData) {
																	var newMonth;
																	var date = new Date(oppurtunityData[key].oppurtunity_close_date);
																	var month = date.getMonth() + 1;
																	switch(month){
																		case 1 : 
																			newMonth =  'January';
																			break;
																		case 2 : 
																			newMonth = 'February';
																			break;
																		case 3 : 
																			newMonth = 'March';
																			break;
																		case 4 : 
																			newMonth = 'April';
																			break;
																		case 5 : 
																			newMonth = 'May';
																			break;
																		case 6 : 
																			newMonth = 'June';
																			break;
																		case 7 : 
																			newMonth = 'July';
																			break;
																		case 8 : 
																			newMonth = 'August';
																			break;
																		case 9 : 
																			newMonth = 'September';
																			break;
																		case 10 : 
																			newMonth = 'October';
																			break;
																		case 11 : 
																			newMonth = 'November';
																			break;
																		case 12 : 
																			newMonth = 'December';
																			break;
																	}
																	return newMonth + " " + date.getDate() + " " + date.getFullYear();
																}
															},
															AccountLogEmailTime : function(){
																for (var key in accountLogemail) {
																	var newMonth;
																	var date = new Date(accountLogemail[key].date_created);
																	var month = date.getMonth() + 1;
																	switch(month){
																		case 1 : 
																			newMonth =  'January';
																			break;
																		case 2 : 
																			newMonth = 'February';
																			break;
																		case 3 : 
																			newMonth = 'March';
																			break;
																		case 4 : 
																			newMonth = 'April';
																			break;
																		case 5 : 
																			newMonth = 'May';
																			break;
																		case 6 : 
																			newMonth = 'June';
																			break;
																		case 7 : 
																			newMonth = 'July';
																			break;
																		case 8 : 
																			newMonth = 'August';
																			break;
																		case 9 : 
																			newMonth = 'September';
																			break;
																		case 10 : 
																			newMonth = 'October';
																			break;
																		case 11 : 
																			newMonth = 'November';
																			break;
																		case 12 : 
																			newMonth = 'December';
																			break;
																	}
																	return newMonth + " " + date.getDate() + " " + date.getFullYear();
																}
															},
															accountPostTime : function(){
																for (var key in accountTaskLog) {
																	var newMonth;
																	var date = new Date(accountTaskLog[key].date_created);
																	var month = date.getMonth() + 1;
																	var hour = date.getHours() + 1;
																	var min = date.getMinutes();
																	var sec = date.getSeconds();
																	switch(month){
																		case 1 : 
																			newMonth =  'January';
																			break;
																		case 2 : 
																			newMonth = 'February';
																			break;
																		case 3 : 
																			newMonth = 'March';
																			break;
																		case 4 : 
																			newMonth = 'April';
																			break;
																		case 5 : 
																			newMonth = 'May';
																			break;
																		case 6 : 
																			newMonth = 'June';
																			break;
																		case 7 : 
																			newMonth = 'July';
																			break;
																		case 8 : 
																			newMonth = 'August';
																			break;
																		case 9 : 
																			newMonth = 'September';
																			break;
																		case 10 : 
																			newMonth = 'October';
																			break;
																		case 11 : 
																			newMonth = 'November';
																			break;
																		case 12 : 
																			newMonth = 'December';
																			break;
																	}
																	return newMonth + " " + date.getDate() + " " + date.getFullYear() + " " + hour + ":" + min + " " + sample(sec)
																}
															},
															AccountLogCallTime : function(){
																for (var key in accountLogCall) {
																	var newMonth;
																	var date = new Date(accountLogCall[key].date_created);
																	var month = date.getMonth() + 1;
																	switch(month){
																		case 1 : 
																			newMonth =  'January';
																			break;
																		case 2 : 
																			newMonth = 'February';
																			break;
																		case 3 : 
																			newMonth = 'March';
																			break;
																		case 4 : 
																			newMonth = 'April';
																			break;
																		case 5 : 
																			newMonth = 'May';
																			break;
																		case 6 : 
																			newMonth = 'June';
																			break;
																		case 7 : 
																			newMonth = 'July';
																			break;
																		case 8 : 
																			newMonth = 'August';
																			break;
																		case 9 : 
																			newMonth = 'September';
																			break;
																		case 10 : 
																			newMonth = 'October';
																			break;
																		case 11 : 
																			newMonth = 'November';
																			break;
																		case 12 : 
																			newMonth = 'December';
																			break;
																	}
																	return newMonth + " " + date.getDate() + " " + date.getFullYear();
																}
															},
															oppurStage : function(){
																for(var key in oppurtunityData){
																	if ( oppurtunityData[key].oppurtunity_stage == '1' ) {
																	    return 'Qualification'
																	} else if ( oppurtunityData[key].oppurtunity_stage == '2' ) {
																	    return 'Needs Analysis'
																	} else if ( oppurtunityData[key].oppurtunity_stage == '3' ) {
																	    return 'Proposal'
																	} else if ( oppurtunityData[key].oppurtunity_stage == '4' ) {
																	    return 'Negotiation'
																	} else if ( oppurtunityData[key].oppurtunity_stage == '5' ) {
																	    return 'Closed Won'
																	} else if ( oppurtunityData[key].oppurtunity_stage == '6' ) {
																	    return 'Close Lost'
																	}
																}
															}
														}
													}
												);
											})
										});
									});
								});
							})
						});
					});
				});
			});
		});
});

//get admin-create-account
router.get('/add_new', ensureAuthenticated, userPermissionAccess, function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
	res.render('accounts/accounts_add_new',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo : logo,
			active : {
				account : true
			}
		}
	);
});

//get admin-edit-account
router.get('/edit/:id', ensureAuthenticated, userPermissionAccess, function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
	res.render('accounts/accounts_edit',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo : logo,
			active : {
				account_edit : true
			}
		}
	);
});

router.get('/sample/api', function(req,res){
	var obj = {};
	obj.id = '1';
	obj.name = 'Joel Ralph';
	obj.avatar = 'http://cdn0.4dots.com/i/customavatars/avatar7112_1.gif';
	obj.type = 'Contact';

	res.json(obj);
})

//http request CRUD function


router.post('/add_new', function(req, res){
	var account_name = req.body.account_name;
	var account_type = req.body.account_type;
	var website_url = req.body.website_url;
	var description = req.body.description;
	var account_owner = req.body.account_owner;
	var phone_number = req.body.phone_number;
	var industry = req.body.industry;
	var address = req.body.address;
	var city = req.body.city;
	var country = req.body.country;
	var number_of_employees = req.body.number_of_employees;

	var errors = req.validationErrors();

	if (errors) {
		// res.render('register',{errors:errors});
		console.log('errors');
	} else{
		var newAccount = new AccountModel({

			account_name : account_name,
			account_type : account_type,
			website_url : website_url,
			description : description,
			account_owner : account_owner,
			phone_number : phone_number,
			industry : industry,
			address : address,
			city : city,
			country : country,
			number_of_employees : number_of_employees

		});

		AccountModel.createAccount(newAccount, function(err,account){
			if (err) throw err;
			console.log(account);
		});
		// req.flash('success_msg', "added accounts");

		// res.redirect('/admin/accounts');
	}
	res.send('created account');
});


//update accounts
router.put('/edit_account', function(req,res){
	var account_name = req.body.account_name;
	var account_type = req.body.account_type;
	var website_url = req.body.website_url;
	var description = req.body.description;
	var account_owner = req.body.account_owner;
	var phone_number = req.body.phone_number;
	var industry = req.body.industry;
	var address = req.body.address;
	var city = req.body.city;
	var country = req.body.country;
	var number_of_employees = req.body.number_of_employees;
	var account_id = req.body.account_id;

	AccountModel.findOneAndUpdate({
		_id:account_id
	},
		{ 
			$set: 
				{ 
					account_name : account_name,
					account_type : account_type,
					website_url : website_url,
					description : description,
					account_owner : account_owner,
					phone_number : phone_number,
					industry : industry,
					address : address,
					city : city,
					country : country,
					number_of_employees : number_of_employees
				 },

		},
		{ upsert: true },
		function(err, newAccounts){
			if (err) {
				console.log("errors tanga");
			} else {
				console.log(newAccounts);
				//res.status(204);
			}
			res.send('success updating account');
	});
});

router.post('/add_log_on_email', function(req,res){
	var obj = {};
	var subject = req.body.subject;
	var comments = req.body.comments;
	var account = req.body.account;
	var assigned = req.body.assigned
	var created_by = req.user._id;
	var errors = req.validationErrors();

	if (errors) {
		// res.render('register',{errors:errors});
		console.log('errors');
	} else{
		var newLogEmail = new LogEmailModel({

			subject : subject,
			comments : comments,
			account : account,
			assigned : assigned,
			created_by : created_by

		});

		LogEmailModel.createLogEmail(newLogEmail, function(err,logEmail){
			if (err) throw err;
			console.log(logEmail);
		});
		// req.flash('success_msg', "added accounts");

		// res.redirect('/admin/accounts');
	}
	res.send('Success on Log an Email');
});


router.put('/update_log_email', function(req,res){
	var subject = req.body.subject;
	var comments = req.body.comments;
	var account = req.body.account;
	var assigned = req.body.assigned
	var priority = req.body.priority;
	var status = req.body.status;
	var log_email_id = req.body.log_email_id;

	LogEmailModel.findOneAndUpdate({
		_id:log_email_id
	},
		{ 
			$set: 
				{ 
					subject : subject,
					comments : comments,
					account : account,
					priority : priority,
					status : status,
					assigned : assigned
				 },

		},
		{ upsert: false },
		function(err, newLogEmail){
			if (err) {
				console.log('updated Log Email');
			} else {
				console.log(newLogEmail);
				//res.status(204);
			}
			res.send('success updating Log Email');
	});
});


router.delete('/delete_log_email', function(req,res){
	var obj = {};
	var log_email_id = req.body.log_email_id;
	LogEmailModel.findOneAndRemove({_id:log_email_id})
		.exec()
		.then((logEmail) => {
			console.log('deleted');
		})
		.catch((err) => {
			console.log('error');
		})
		res.send('Deleted');
});


// log a call


//delete log a call

router.delete('/delete_log_call', function(req,res){
	var obj = {};
	var log_id = req.body.log_id;
	LogACallModel.findOneAndRemove({_id:log_id})
		.exec()
		.then((results) => {
			res.send('deleted')
		})
		.catch((err) => {
			res.send('error in deleting');
		})
});

// edit log a call

router.put('/edit_Lac', function(req,res){
	var obj = {};
	var subject = req.body.subject;
	var comments = req.body.comments;
	var priority = req.body.priority;
	var status = req.body.status;
	var log_id = req.body.log_id;
	
	LogACallModel.findByIdAndUpdate({_id:log_id},
		{
			$set:
			{
				subject : subject,
				comments : comments,
				priority : priority,
				status : status
			},
		},
		{upsert: false},
		function(err, updateLog){
			if (err) {
				console.log('error');
			} else {
				res.send("success");
			}
		});
});



//add post

router.post('/add_post', function(req,res){
	var obj = {};
	var post = req.body.post;
	var account = req.body.account_id;
	var user = req.user._id;

	var errors = req.validationErrors();

	if (errors) {
		console.log('errors');
	} else {
		var newPost = new PostModel({
			post : post,
			account : account,
			user : user
		});

		PostModel.createPost(newPost, function(err, post){
			if (err) {
				res.send('err');
			} else{
				res.send('success');
				console.log(post);
			}
		});
	}

});


//api's

//find all data in Accounts table

router.get('/api', function(req,res){
	AccountModel.find({})
		.populate('account_owner')
		.exec()
		.then((accounts) => {
			console.log(accounts);
			res.json(accounts);
		})
		.catch((err) => {
			res.send("error occured");
		});
});

//find one data in Accounts table

router.get('/api/:id' , function(req,res){
	AccountModel.findById({
		_id:req.params.id
	})
	.populate('account_owner')
	.exec()
	.then((accounts) => {
		console.log(accounts);
		res.json(accounts);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//find by account
router.get('/api/log_email/:id', function(req,res){
	LogEmailModel.find({account:req.params.id})
	.populate('created_by')
	.populate('account')
	.populate('assigned')
	.exec()
	.then((logEmail) =>{
		res.json(logEmail)
	})
	.catch((err) => {
		res.send('error occured');
	})
})

//find by ID

router.get('/api/log_email_single/:id', function(req,res){
	LogEmailModel.findOne({_id:req.params.id})
	.populate('created_by')
	.populate('account')
	.populate('assigned')
	.exec()
	.then((logEmail) =>{
		res.json(logEmail)
	})
	.catch((err) => {
		res.send('error occured');
	})
});

//show task by account

router.get('/api/tasks/:account_id', function(req,res){
	TasksModel.find({account:req.params.account_id})
		.sort({date_created : -1})
		.populate('account')
		.populate('assigned')
		.populate('created_by')
		.exec(function(err,results){
			res.send(results);
		})
});

//find task by account by ID

router.get('/api/one_task/:id', function(req,res){
	TasksModel.findOne({_id:req.params.id})
	.sort({date_created : -1})
	.populate('account')
	.populate('assigned')
	.populate('created_by')
	.exec(function(err,results){
		res.send(results);
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

function sample(el){
	return 'hello';
}

module.exports = router;