var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');

var AccountModel = require('../model/admin');
var OpportunityModel = require('../model/oppurtunity');
var OppurtunityLogEmailModel = require('../model/oppurtunitylogemail');
var OppurLogCall = require('../model/oppurtunitylogcall');
var OppurtunityTaskModel = require('../model/oppurtunitytask');

//get admin oppurtunity
router.get('/', ensureAuthenticated, userPermissionAccess,  function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var logo = "../assets/layouts/layout/img/logo.png";
	AccountModel.find({}).exec(function(err,results){
		if (err) return err;
		res.render('opportunity/opportunity',  
			{
				results : results,
				userid : user_id, 
				userName : user_name, 
				userImgPath : path,
				logo : logo,
				active : {
					opportunity : true
				}
			}
		);
	});
});

router.get('/show_opportunity/:id', ensureAuthenticated, userPermissionAccess,  function(req, res){
	var user_id = req.user._id;
	var user_name = req.user.fullname;
	var path = req.user.path;
	var opp_id = req.params.id;
	var logo = "../../../assets/layouts/layout/img/logo.png";
	AccountModel.find({}).exec(function(err,results){
		if (err) return err;
		OpportunityModel.findOne({_id:req.params.id}).populate('oppurtunity_account').populate('oppurtunity_owner').exec(function(err,OppResults){
			if (err) return err;
			OpportunityModel.find({}).exec(function(err,allOppData){
				if (err) return err;
				OppurtunityLogEmailModel.find({oppurtunity:opp_id}).populate('created_by').populate('account').populate('assigned').exec(function(err,opplogemail){
					if (err) return err;
					OppurLogCall.find({Oppurtunity:opp_id}).populate('created_by').populate('Oppurtunity').populate('assigned').exec(function(err,oppLogCall){
						if (err) return err;
						OppurtunityTaskModel.find({opportunity:opp_id}).populate('created_by').populate('campaign').populate('account').populate('assigned').populate('opportunity').exec(function(err,oppTasks){
							if (err) return err;
							res.render('opportunity/show_opportunity',  
								{
									oppTasks : oppTasks,
									oppLogCall : oppLogCall,
									opplogemail : opplogemail,
									allOppData : allOppData,
									OppResults : OppResults,
									results : results,
									userid : user_id, 
									userName : user_name, 
									userImgPath : path,
									logo : logo,
									active : {
										show_opportunity : true
									},
									helpers : {
										convertTime : function(){
												var newMonth;
												var date = new Date(OppResults.oppurtunity_close_date);
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
										},
										LeadLogEmailTime : function(){
											for(var key in opplogemail) {
												var newMonth;
												var date = new Date(opplogemail[key].date_created);
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
										OppCallConvertTime : function () {
											for(var key in oppLogCall) {
												var newMonth;
												var date = new Date(oppLogCall[key].date_created);
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
										OppTaskConvertTime : function(){
											for(var key in oppTasks) {
												var newMonth;
												var date = new Date(oppTasks[key].date_created);
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
										OppStagesFunc : function(){
											var opp_stage  = OppResults.oppurtunity_stage;
											if ( opp_stage == '1') {
												return 'Qualification';
											} else if ( opp_stage == '2' ) {
												return 'Needs Analysis';
											} else if ( opp_stage == '3' ) {
												return 'Proposal';
											} else if ( opp_stage == '4' ) {
												return 'Negotiation';
											} else if ( opp_stage == '5' ) {
												return 'Closed Won';
											} else if (opp_stage == '6') {
												return 'Close Lost;'
											}
										}
									}
								}
							);
						})
					});
				})
			})
		});
	});
});


//CRUD Function

router.post('/add_new', function(req, res){
	var oppurtunity_name = req.body.oppurtunity_name;
	var oppurtunity_account = req.body.oppurtunity_account;
	var oppurtunity_account_type = req.body.oppurtunity_account_type;
	var oppurtunity_owner = req.body.oppurtunity_owner;
	var oppurtunity_close_date = req.body.oppurtunity_close_date;
	var oppurtunity_stage = req.body.oppurtunity_stage;
	var oppurtunity_probability = req.body.oppurtunity_probability;
	var oppurtunity_amount = req.body.oppurtunity_amount;
	var errors = req.validationErrors();

	if (errors) {
		// res.render('register',{errors:errors});
		console.log('errors');
	} else{
		var newOppurtunity = new OpportunityModel({

			oppurtunity_name : oppurtunity_name,
			oppurtunity_account : oppurtunity_account,
			oppurtunity_account_type : oppurtunity_account_type,
			oppurtunity_owner : oppurtunity_owner,
			oppurtunity_close_date : oppurtunity_close_date,
			oppurtunity_stage : oppurtunity_stage,
			oppurtunity_probability : oppurtunity_probability,
			oppurtunity_amount : oppurtunity_amount
		});

		OpportunityModel.createOppurtunity(newOppurtunity, function(err,dataResults){
			if (err) throw err;
			console.log(dataResults);
		});
		//req.flash('success_msg', "you are registered and can now login");
	}
	res.send('success');
});


//update Oppurtunities
router.put('/edit_opportunity', function(req,res){
	var opportunity_id = req.body.opportunity_id;
	var oppurtunity_name = req.body.oppurtunity_name;
	var oppurtunity_account = req.body.oppurtunity_account;
	var oppurtunity_account_type = req.body.oppurtunity_account_type;
	var oppurtunity_owner = req.body.oppurtunity_owner;
	var oppurtunity_close_date = req.body.oppurtunity_close_date;
	var oppurtunity_stage = req.body.oppurtunity_stage;
	var oppurtunity_probability = req.body.oppurtunity_probability;
	var oppurtunity_amount = req.body.oppurtunity_amount;

	OpportunityModel.findOneAndUpdate({
		_id:opportunity_id
	},
		{ 
			$set: 
				{ 
					oppurtunity_name : oppurtunity_name,
					oppurtunity_account : oppurtunity_account,
					oppurtunity_account_type : oppurtunity_account_type,
					oppurtunity_owner : oppurtunity_owner,
					oppurtunity_close_date : oppurtunity_close_date,
					oppurtunity_stage : oppurtunity_stage,
					oppurtunity_probability : oppurtunity_probability,
					oppurtunity_amount : oppurtunity_amount
				 },

		},
		{ upsert: true },
		function(err, NewOppurtunityCreated){
			if (err) {
				console.log("errors tanga");
			} else {
				console.log(NewOppurtunityCreated);
			}
	});
	res.send('Updated Opportunity');
});


router.put('/edit_opportunity_stages', function(req,res){
	var opportunity_id = req.body.opportunity_id;
	var oppurtunity_stage = req.body.oppurtunity_stage;

	OpportunityModel.findOneAndUpdate({
		_id:opportunity_id
	},
		{ 
			$set: 
				{ 
					oppurtunity_stage : oppurtunity_stage,
				 },

		},
		{ upsert: true },
		function(err, NewOppurtunityCreated){
			if (err) {
				console.log("errors tanga");
			} else {
				console.log(NewOppurtunityCreated);
				//res.status(204);
			}
	});
	res.send('Updated Opportunity Stage');
});

//delete Oppurtunities
router.delete('/delete_opportunity', function(req,res){
	var opportunity_id = req.body.opportunity_id;
	OpportunityModel.findOneAndRemove({
		_id : opportunity_id
	})
	.exec()
	.then((oppurtunity) => {
		console.log('DELETED');
		res.json(oppurtunity);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//log email

router.post('/add_email_log', function(req,res){
	var obj = {};
	var subject = req.body.subject;
	var comments = req.body.comments;
	var created_by = req.user._id;
	var account = req.body.account;
	var assigned = req.body.assigned;
	var oppurtunity = req.body.oppurtunity;
	var errors = req.validationErrors();

	if (errors) {
		console.log('errors');
	} else{
		var newOppurtunity = new OppurtunityLogEmailModel({

			subject : subject,
			comments : comments,
			created_by : created_by,
			account : account,
			assigned : assigned,
			oppurtunity : oppurtunity
		});

		OppurtunityLogEmailModel.createLogEmail(newOppurtunity, function(err,dataResults){
			if (err) throw err;
			console.log(dataResults);
			console.log(success);
		});
		res.send('success');
		//req.flash('success_msg', "you are registered and can now login");
	}
});

//update log email

router.put('/edit_emaillog', function(req,res){
	var obj = {};

	var logEmailId = req.body.logEmailId;
	var subject = req.body.subject;
	//var account = req.body.account;
	var comments = req.body.comments;
	var assigned = req.body.assigned;
	var priority = req.body.priority;
	var status = req.body.status;

	OppurtunityLogEmailModel.findByIdAndUpdate({
		_id:logEmailId
	},
		{ 
			$set: 
				{ 
					subject : subject,
					//account : account,
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

// delete log email

router.delete('/delete_emaillog', function(req,res){
	var email_log_id = req.body.email_log_id;
	OppurtunityLogEmailModel.findOneAndRemove({_id:email_log_id})
		 .exec()
		 .then((lead) => {
		 	console.log('deleted');
		 	res.json(lead);
		 })
		 .catch((err) => {
		 	res.send('error');
		 })
});

// add log call

router.post('/add_logcall', function(req,res){

	var obj = {};

	var subject = req.body.subject;
	var comments = req.body.comments;
	var created_by = req.user._id;
	var account = req.body.account;
	var opportunity_id = req.body.opportunity_id;

	var errors = req.validationErrors();

	if (errors) {
		console.log('errors');
	} else {
		var newOpportunityLogCall = new OppurLogCall({
			subject : subject,
			comments : comments,
			Oppurtunity : opportunity_id,
			created_by : created_by,
			account : account
		});
		OppurLogCall.createOpportunityLogCall(newOpportunityLogCall, function(err,logacall){
			if (err) {
				console.log('err');
			} else {
				console.log('success');
			}
		});

		res.json('success');
	}
});

// edit log call

router.put('/edit_logcall', function(req,res){
	var obj = {};
	var subject = req.body.subject;
	var comments = req.body.comments;
	var priority = req.body.priority;
	var status = req.body.status;
	var opp_id = req.body.opp_id;

	OppurLogCall.findByIdAndUpdate({
		_id:opp_id
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

//delete log call

router.delete('/delete_log_call', function(req,res){
	var obj = {};
	var loc_id = req.body.loc_id;
	OppurLogCall.findOneAndRemove({_id:loc_id})
		.exec()
		.then((result) => {
			res.send('sucess')
		})
		.catch((err) => {
			res.end('error occured');
		})
});

//get task

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
	var opportunity = req.body.opportunity;

	var errors = req.validationErrors();

	console.log(req.body);

	if (errors) {
		req.send('errors');
	} else {
		var newOppurtunityTask = new OppurtunityTaskModel({
			account : account,
			assigned : assigned,
			comments : comments,
			due_date : due_date,
			kickoff : kickoff,
			priority : priority,
			status : status,
			subject : subject,
			created_by : created_by,
			opportunity : opportunity
		});
		OppurtunityTaskModel.createOppurtunityTask(newOppurtunityTask, function(err,LeadTasks){
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
	var opportunity = req.body.opportunity;


	OppurtunityTaskModel.findByIdAndUpdate({
		_id:task_id
	},
		{ 
			$set: 
				{ 
					account : account,
					assigned : assigned,
					comments : comments,
					due_date : due_date,
					kickoff : kickoff,
					priority : priority,
					status : status,
					subject : subject,
					created_by : created_by,
					opportunity : opportunity
				 },

		},
		{ upsert: false},
		function(err, newTasksData){
			if (err) {
				console.log("errors tanga");
			} else {
				res.send("success");
				//res.status(204);
			}
	});
});

// delete task

router.delete('/delete_task', function(req,res){
	var ojb = {};
	var task_id = req.body.task_id;
	OppurtunityTaskModel.findOneAndRemove({_id:task_id})
		.exec()
		.then((results) => {
			res.send('deleted');
			console.log('deleted');
		})
		.catch((err) => {
			res.send('error in deleting');
			console.log('error in deleting');
		})
});


//get api functions

router.get('/api', function(req,res){
	OpportunityModel.find({})
		.populate('oppurtunity_account')
		.populate('oppurtunity_owner')
		.exec()
		.then((oppurtunities) => {
			console.log(oppurtunities);
			res.json(oppurtunities);
		})
		.catch((err) => {
			res.send("error occured");
		});
});

//find one data in Oppurtunity table

router.get('/api/:id' , function(req,res){
	OpportunityModel.findOne({_id:req.params.id})
	.populate('oppurtunity_account')
	.populate('oppurtunity_owner')
	.exec()
	.then((oppurtunity) => {
		console.log(oppurtunity);
		res.json(oppurtunity);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//find opputunity by account

router.get('/api/accounts/:account_id', function(req,res){
	OpportunityModel.find({oppurtunity_account:req.params.account_id})
		.populate('oppurtunity_account')
		.populate('oppurtunity_owner')
		.exec()
		.then((oppurtunity) => {
			console.log(oppurtunity);
			res.json(oppurtunity);
		})
		.catch((err) => {
			res.send('error occured');
		})
});

//find opp email log
router.get('/api/logemail/:opp_id', function(req,res){
	OppurtunityLogEmailModel.find({oppurtunity:req.params.opp_id})
		.exec()
		.then((opplogemail) => {
			res.json(opplogemail)
		})
		.catch((err) => {
			res.send(err);
		})
});

//find one opp email log
router.get('/api/single/logemail/:id', function(req,res){
	OppurtunityLogEmailModel.findOne({_id:req.params.id})
		.populate('created_by')
		.populate('account')
		.populate('assigned')
		.exec()
		.then((results) => {
			res.json(results)
		})
		.catch((err) => {
			res.send(err);
		})
});

// find opp call log

router.get('/api/logcall/:opp_id', function(req,res){
	OppurLogCall.find({oppurtunity:req.params.opp_id})
		.exec()
		.then((logcall) => {
			res.send(logcall)
		})
		.catch((err) => {
			res.send('err occured');
		})
});

//find one opp call log

router.get('/api/single/logcall/:id', function(req,res){
	OppurLogCall.findOne({_id:req.params.id})
		.exec()
		.then((logcall) => {
			res.send(logcall)
		})
		.catch((err) => {
			res.send('error occured');
		})
});

// find all opp task 

router.get('/api/task/:opp', function(req,res){
	OppurtunityTaskModel.find({opportunity:req.params.opp})
		.exec()
		.then((results) => {
			res.json(results)
		})
		.catch((err) => {
			res.json('error occured');
		})
});

//find one opp task

router.get('/api/one_task/:id', function(req,res){
	OppurtunityTaskModel.findOne({_id:req.params.id})
		.populate('created_by')
		.populate('campaign')
		.populate('account')
		.populate('assigned')
		.populate('opportunity')
		.exec()
		.then((results) => {
			res.json(results)
		})
		.catch((err) => {
			res.json('error occured')
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