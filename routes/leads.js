"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');
var Leads = require('../model/leads');
var Account = require('../model/admin');
var LeadLogCall = require('../model/leadloc');
var LeadPostModel = require('../model/leadpost');
var ContactModel = require('../model/contacts');
var AccountsModel = require('../model/admin');
var LeadsLogEmail = require('../model/leadslogemail');
var LeadTaskModel = require('../model/leadtask');
//show leads

router.get('/', ensureAuthenticated, userPermissionAccess, function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../assets/layouts/layout/img/logo.png";
	res.render('leads/view_leads',  
		{
			userid : user_id, 
			userName : user_name, 
			userImgPath : path,
			logo : logo,
			active : {
				view_leads : true
			}
		}
	);
});

router.get('/view/:id', ensureAuthenticated, userPermissionAccess, function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = '../../../assets/layouts/layout/img/logo.png';
	var lead_id = req.params.id;
	Leads.find({}).where('lead_status').ne('5').exec(function(err,results){
		if (err) return err;
		Leads.findById({_id:lead_id}).populate('owner').exec(function(err,leadResults){
			if (err) return err;
			var lead_status = leadResults.lead_status;
			LeadLogCall.find({leads_id:lead_id}).sort({date_created: -1}).populate('created_by').exec(function(err,leadlogcallData){
				if (err) return err;
				LeadPostModel.find({lead_post:lead_id}).sort({dateCreated : -1}).populate('created_by').exec(function(err,leadpost){
					if (err) return err;
					AccountsModel.find({}).exec(function(err,AccountsData){
						if (err) return err;
						LeadsLogEmail.find({leads:lead_id})
							.sort({created_by : -1})
							.populate('created_by')
							.populate('account')
							.populate('assigned')
							.exec(function(err,leadLogEmailData){
								if(err) return err;
								LeadTaskModel.find({leads:lead_id})
								.sort({date_created:-1})
								.populate('created_by')
								.populate('campaign')
								.populate('assigned')
								.populate('leads')
								.exec(function(err,leadTaskData){
									if(err) return err;
									res.render('leads/show_leads',  
										{
												userId : user_id,
												userName : user_name,
												leadpost : leadpost,
												results : results,
												leadlogcallData : leadlogcallData,
												leadLogEmailData : leadLogEmailData,
												leadTaskData : leadTaskData,
												lead_title : results.title,
										 		leadResults : leadResults,
										 		userid : user_id, 
										 		userName : user_name, 
										 		userImgPath : path,
										 		logo : logo,
										 		AccountsData : AccountsData,
										 		active : {
										 			show_leads : true
										 		},
										 		helpers : {
										 			leadStatus : function(){
										 				if (lead_status == '1') {
										 					return 'Unqualified'
										 				} else if (lead_status == '2') {
										 					return 'New'
										 				} else if (lead_status == '3') {
										 					return 'Nurturing'
										 				} else if (lead_status == '4') {
										 					return 'Qualified'
										 				} else if (lead_status == '5') {
										 					return 'Converted'
										 				} 
										 			},
										 			LeadLogEmailTime : function(date) {
										 				for (var key in leadLogEmailData) {
										 					var newMonth;
										 					var date = new Date(leadLogEmailData[key].date_created);
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
										 			leadlogAcall : function(){
										 				for (var key in leadlogcallData){
										 					var newMonth;
										 					var date = new Date(leadlogcallData[key].date_created);
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
										 			timePostLead : function(){
										 				for (var key in leadpost){
										 					var newMonth;
										 					var date = new Date(leadpost[key].dateCreated);
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
										 			timeLeadTasks : function(){
										 				for (var key in leadTaskData) {
										 					var newMonth;
										 					var date = new Date(leadTaskData[key].due_date);
										 					var month = date.getMonth();
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
										 			getTimeFunc : function(){
										 				for (var key in leadpost){
										 					var date = new Date(leadpost[key].dateCreated);
										 					var hour = date.getHours();
										 					var min = date.getMinutes();
										 					var sec = date.getSeconds();
										 					return hour + ':' + min + ':' + sec
										 				}
										 			}
										 		}
										 	}
										 ); // end of render
								})
							})
					});
				});
			})
		});	
	});
});


//api's

router.get('/api', function(req,res){
	Leads.find({})
		 .where('lead_status').ne('5')
		 .populate('owner')
		 .exec()
		 .then((leads) =>{
		 	res.json(leads);
		 })
		 .catch((err) => {
		 	res.json('error');
		 })
});

router.get('/api/:id', function(req,res){
	Leads.findById({_id:req.params.id})
		 .populate('owner')
		 .exec()
		 .then((leads) =>{
		 	res.json(leads);
		 })
		 .catch((err) => {
		 	res.json('error');
		 })
});

router.get('/lead_log_a_call/api', function(req,res){
	LeadLogCall.find({})
				.exec()
				.then((result) => {
					console.log(result);
					res.json(result);
				})
				.catch((err) => {
					console.log('error tanga');
				});
})

router.get('/lead_log_a_call/api/:id', function(req,res){
	LeadLogCall.findById({_id:req.params.id})
				.exec()
				.then((logACall) => {
					console.log(logACall);
					res.json(logACall);
				})
				.catch((err) => {
					return err;
				});
})

router.get('/lead_post/api', function(req,res){
	LeadPostModel.find({})
				 .sort({dateCreated : -1})
				 .populate('created_by')
				 .exec()
				 .then((results) => {
				 	res.json(results);
				 })
				 .catch((err) => {
				 	return err;
				 })
});

router.get('/lead_post/post/api/:id', function(req,res){
	LeadPostModel.findById({_id:req.params.id})
				 .sort({dateCreated : -1})
				 .populate('created_by')
				 .exec()
				 .then((results) => {
				 	res.json(results);
				 })
				 .catch((err) => {
				 	return err;
				 })
});

router.get('/lead_post/api/:id', function(req,res){
	LeadPostModel.find({lead_post:req.params.id})
	 .sort({dateCreated : -1})
	 .populate('created_by')
	 .exec()
	 .then((results) => {
	 	res.json(results);
	 })
	 .catch((err) => {
	 	return err;
	 })
});

router.get('/lead_email/api/:id', function(req,res){
	LeadsLogEmail.find({leads:req.params.id})
		.sort({date_created: -1})
		.populate('created_by')
		.populate('account','account_name')
		.populate('assigned','fullname')
		.exec()
		.then((results) => {
			res.json(results);
		})
		.catch((err) => {
			return err;
		})
});

router.get('/lead_log_email/api/:id', function(req, res){
	LeadsLogEmail.findOne({_id:req.params.id})
		.sort({date_created: -1})
		.populate('created_by')
		.populate('account')
		.populate('assigned')
		.exec()
		.then((results) => {
			res.json(results)
		})
		.catch((err) => {
			return err;
		})
});

router.get('/lead_task/api/:id', function(req,res){
	LeadTaskModel.findOne({_id:req.params.id})
		.populate('created_by')
		.populate('campaign')
		.populate('assigned')
		.populate('leads')
		.exec()
		.then((results) => {
			res.json(results)
		})
		.catch((err) => {
			return err;
		})
})

//CRUD function

router.post('/add_lead', function(req,res){

	var lead_status = req.body.lead_status;
	var fullname = req.body.fullname;
	var title = req.body.title;
	var company = req.body.company;
	var email = req.body.email;
	var lead_source = req.body.lead_source;
	var city = req.body.city;
	var country = req.body.country;
	var owner = req.body.owner;
	var phone = req.body.phone;
	var address = req.body.address;
	var industry = req.body.industry;
	var number_of_employees = req.body.number_of_employees;
	var website = req.body.website;
	var notes = req.body.notes;
	var errors = req.validationErrors();
	if (errors) {
		console.log('error occured');
	} else {
		var newLeadObj = new Leads({

			lead_status : lead_status,
			fullname : fullname,
			title : title,
			company : company,
			address : address,
			email : email,
			lead_source : lead_source,
			city : city,
			country : country,
			owner : owner,
			phone : phone,
			industry : industry,
			number_of_employees : number_of_employees,
			website : website,
			notes : notes

		});

		newLeadObj.save(function(err,leads){
			if(err) console.log(err);
			res.send(leads);
		})
	}



	// createLeadFunc(function(err,leads){
	// 	if(err) console.log(err);
	// 	if (leads) console.log(leads);
	// 	res.send(leads);
	// });

	// function createLeadFunc(callback){
	// 	var someData = newLeadObj;
	// 	var newLeadObj = new Leads(someData);
	// 	newLeadObj.save(function(err,leads){
	// 		if(err) console.log(err,leads);
	// 		if (leads) callback(null, leads);
	// 	});
	// }
});

router.put('/edit_status_lead', function(req,res){
	var obj = {};
	var lead_id = req.body.lead_id;
	var lead_status = req.body.lead_status;
	Leads.findByIdAndUpdate({
		_id:lead_id
	},
		{ 
			$set: 
				{ 
					lead_status : lead_status
				 },

		},
		{ upsert: true},
		function(err, newLead){
			if (err) {
				console.log("errors tanga");
			} else {
				res.send("success");
				//res.status(204);
			}
	});

});

router.put('/edit_status', function(req,res){
	var obj = {};
	var lead_id = req.body.lead_id;
	var lead_status = req.body.lead_status;
	var fullname = req.body.fullname;
	var title = req.body.title;
	var company = req.body.company;
	var email = req.body.email;
	var lead_source = req.body.lead_source;
	var city = req.body.city;
	var country = req.body.country;
	var phone = req.body.phone;
	var address = req.body.address;
	var number_of_employees = req.body.number_of_employees;
	var industry = req.body.industry;
	var website = req.body.website;
	var notes = req.body.notes;
	Leads.findByIdAndUpdate({
		_id:lead_id
	},
		{ 
			$set: 
				{ 
					lead_status : lead_status,
					fullname : fullname,
					title : title,
					company : company,
					address : address,
					email : email,
					lead_source : lead_source,
					city : city,
					country : country,
					phone : phone,
					number_of_employees : number_of_employees,
					industry : industry,
					website : website,
					notes : notes
				 },

		},
		{ upsert: false },
		function(err, newLead){
			if (err) return err;
			console.log('success');
	});
	res.send('Updated Leads')
});

router.delete('/delete_lead/:id', function(req,res){
	var lead_id = req.params.id;
	Leads.findOneAndRemove({_id:lead_id})
		 .exec()
		 .then((lead) => {
		 	console.log('deleted');
		 	res.json(lead);
		 })
		 .catch((err) => {
		 	res.send('error');
		 })
});


router.post('/convert_account', function(req,res){

	var UpdateLeadStatus = {
			lead_id : req.body.leads_id,
			lead_status : '5'
	}
	
	var createAccountObj = {

		account_name : req.body.account_name,
		account_owner : req.body.account_owner,
		lead_source : req.body.lead_source,
		industry : req.body.industry,
		website : req.body.website,
		number_of_employees : req.body.number_of_employees,
		address : req.body.address,
		city : req.body.city,
		country : req.body.country,
		phone_number : req.body.phone

	};

	
	createAccountFunc(function(err,account){
		if(err) console.log(err);
		if (account) console.log(account._id);
		res.send(account);

	});

	function createAccountFunc(callback){
		var someData = createAccountObj;
		var newAccounts = new Account(someData);
		newAccounts.save(function(err,account){
			if(err) console.log(err,account);
			if (account) callback(null, account);
		});
	}

});

router.post('/add_logcall', function(req,res){

	var obj = {};

	var subject = req.body.subject;
	var comments = req.body.comments;
	var created_by = req.user._id;
	// var account = req.body.account;
	var leads_id = req.body.leads_id;

	var errors = req.validationErrors();

	if (errors) {
		console.log('errors');
	} else {
		var newleadLogCall = new LeadLogCall({
			subject : subject,
			comments : comments,
			leads_id : leads_id,
			created_by : created_by
		});
		LeadLogCall.createLeadLogCall(newleadLogCall, function(err,logacall){
			if (err) {
				console.log('err');
			} else {
				console.log('success');
			}
		});

		res.json('success');
	}
});

router.put('/edit_logcall', function(req,res){
	var obj = {};
	var subject = req.body.subject;
	var comments = req.body.comments;
	var priority = req.body.priority;
	var status = req.body.status;
	var loc_id = req.body.loc_id;

	LeadLogCall.findByIdAndUpdate({
		_id:loc_id
	},
		{ 
			$set: 
				{ 
					subject : subject,
					comments : comments,
					priority : priority,
					status : status
				 },

		},
		{ upsert: false },
		function(err, newLeadLogcall){
			if (err) {
				console.log("errors tanga");
			} else {
				res.send("success");
				//res.status(204);
			}
	});

});

router.delete('/delete_logacall',function(req,res){
	var obj = {};
	var loc_id = req.body.loc_id;
	LeadLogCall.findOneAndRemove({_id:loc_id})
		 .exec()
		 .then((results) => {
		 	console.log('deleted');
		 	res.send('deleted');
		 })
		 .catch((err) => {
		 	res.send('error');
		 })
});

router.post('/add_lead_post', function(req,res){
	var obj = {};
	var post = req.body.post;
	var created_by = req.body.created_by;
	var lead_post = req.body.lead_post;

	var errors = req.validationErrors();
	console.log(req.body);

	if (errors) {
		console.log('errors');
	} else {
		var newPostLead = new LeadPostModel({
			post : post,
			created_by : created_by,
			lead_post : lead_post
		});
		LeadPostModel.CreateLeadPost(newPostLead, function(err,LeadPost){
			if (err) {
				console.log('err');
			} else {
				console.log('success');
			}
		});

		res.json('success');
	}
})

router.post('/add_emailLog', function(req,res){
	var obj = {};
	var subject = req.body.subject;
	var created_by = req.user;
	var leads = req.body.leads;
	//var account = req.body.account;
	var comments = req.body.comments;
	//var assigned = req.body.assigned;

	var errors = req.validationErrors();

	if (errors) {
		req.send('errors');
	} else {
		var newLeadLogEmail = new LeadsLogEmail({
			subject : subject,
			created_by : created_by,
			leads : leads,
			//account : account,
			comments : comments,
			//assigned : assigned
		});
		LeadsLogEmail.createLogEmail(newLeadLogEmail, function(err,logEmail){
			if (err) {
				console.log('error')
			} else {
				console.log('success');
			}
		})
		res.json('success');
	}
});

router.put('/edit_emaillog', function(req,res){
	var obj = {};

	var logEmailId = req.body.logEmailId;
	var subject = req.body.subject;
	var leads = req.body.leads;
	var account = req.body.account;
	var comments = req.body.comments;
	var assigned = req.body.assigned;
	var priority = req.body.priority;
	var status = req.body.status;

	LeadsLogEmail.findByIdAndUpdate({
		_id:logEmailId
	},
		{ 
			$set: 
				{ 
					subject : subject,
					account : account,
					comments : comments,
					assigned : assigned,
					priority : priority,
					status : status
				 },

		},
		{ upsert: false},
		function(err, newLogEmail){
			if (err) {
				console.log("errors tanga");
			} else {
				res.send("success");
				//res.status(204);
			}
	});
});

router.delete('/delete_emaillog', function(req,res){
	var email_log_id = req.body.email_log_id;
	LeadsLogEmail.findOneAndRemove({_id:email_log_id})
		 .exec()
		 .then((lead) => {
		 	console.log('deleted');
		 	res.json(lead);
		 })
		 .catch((err) => {
		 	res.send('error');
		 })
});

router.post('/add_task', function(req,res){
	var obj = {};
	var account = req.body.account;
	var assigned = req.body.assigned;
	var comments = req.body.comments;
	var due_date = req.body.due_date;
	var kickoff = req.body.kickoff;
	var priority = req.body.priority;
	var status = req.body.status;
	var subject = req.body.subject;
	var created_by = req.user._id;
	var leads = req.body.leads;

	var errors = req.validationErrors();

	if (errors) {
		req.send('errors');
	} else {
		var newLeadTask = new LeadTaskModel({
			account : account,
			assigned : assigned,
			comments : comments,
			due_date : due_date,
			kickoff : kickoff,
			priority : priority,
			status : status,
			subject : subject,
			created_by : created_by,
			leads : leads
		});
		LeadTaskModel.createLeadTask(newLeadTask, function(err,LeadTasks){
			if (err) {
				console.log('error')
			} else {
				console.log('success');
			}
		})
		res.json('success');
	}
});

router.put('/update_tasks', function(req,res){
	var obj = {};
	var account = req.body.account;
	var assigned = req.body.assigned;
	var comments = req.body.comments;
	var due_date = req.body.due_date;
	var kickoff = req.body.kickoff;
	var priority = req.body.priority;
	var status = req.body.status;
	var subject = req.body.subject;
	var created_by = req.user._id;
	var task_id = req.body.task_id;
	var leads = req.body.leads;

	res.send('hello');

	// LeadTaskModel.findByIdAndUpdate({
	// 	_id:task_id
	// },
	// 	{ 
	// 		$set: 
	// 			{ 
	// 				account : account,
	// 				assigned : assigned,
	// 				comments : comments,
	// 				due_date : due_date,
	// 				kickoff : kickoff,
	// 				priority : priority,
	// 				status : status,
	// 				subject : subject,
	// 				created_by : created_by,
	// 				leads : leads
	// 			 },

	// 	},
	// 	{ upsert: false},
	// 	function(err, newTasksData){
	// 		if (err) {
	// 			console.log("errors tanga");
	// 		} else {
	// 			res.send("success");
	// 			//res.status(204);
	// 		}
	// });
});

router.delete('/delete_tasks', function(req,res){
	var task_id = req.body.task_id;
	LeadTaskModel.findOneAndRemove({_id:task_id})
		 .exec()
		 .then((tasks) => {
		 	console.log('deleted');
		 	res.json(tasks);
		 })
		 .catch((err) => {
		 	res.send('error');
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
		console.log('User is Login');
		return next();
	} else {
		//console.log('Welcome ' + req.user.fullname);
		res.send(404,'youre not allowed');
	}
}

module.exports = router;
